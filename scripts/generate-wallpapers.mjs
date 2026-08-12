#!/usr/bin/env node
/**
 * Generates real AI wallpapers for every niche in priority-niches.json, at
 * three fixed aspect ratios each (phone / desktop / square) — deliberately
 * not "every possible dimension," since one AI generation is one image at
 * one resolution. Uploads to Supabase Storage and writes a row per wallpaper
 * into the `wallpapers` table so the live site can query real data.
 *
 * Requires:
 *   FAL_KEY                    — from fal.ai (Settings → API Keys)
 *   SUPABASE_URL                — same URL as in js/config.js
 *   SUPABASE_SERVICE_ROLE_KEY  — Project Settings → API → service_role
 *                                 (NEVER put this in js/config.js or commit it —
 *                                  it belongs in a local .env file only, which
 *                                  is already in .gitignore)
 *
 * Usage:
 *   node scripts/generate-wallpapers.mjs                  # 1 wallpaper per niche (x3 ratios)
 *   node scripts/generate-wallpapers.mjs --count=3         # 3 per niche
 *   node scripts/generate-wallpapers.mjs --only=galaxy,y2k # just these niches
 */

import { createClient } from "@supabase/supabase-js";

const FAL_KEY = process.env.FAL_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!FAL_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error([
    "Missing required environment variables. Set these before running:",
    "  FAL_KEY                    (from fal.ai)",
    "  SUPABASE_URL",
    "  SUPABASE_SERVICE_ROLE_KEY  (Project Settings -> API -> service_role, NOT the public key)",
    "",
    "Example (macOS/Linux):",
    '  FAL_KEY=xxx SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/generate-wallpapers.mjs',
    "",
    "Example (Windows PowerShell):",
    '  $env:FAL_KEY="xxx"; $env:SUPABASE_URL="https://xxx.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="xxx"; node scripts/generate-wallpapers.mjs'
  ].join("\n"));
  process.exit(1);
}

const countArg = process.argv.find(a => a.startsWith("--count="));
const COUNT_PER_NICHE = countArg ? parseInt(countArg.split("=")[1], 10) : 1;
const onlyArg = process.argv.find(a => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.split("=")[1].split(",") : null;

// Three fixed, honest aspect ratios per concept — not an unlimited-dimensions claim.
const RATIOS = [
  { id: "phone",   width: 1080, height: 1920, image_size: { width: 1080, height: 1920 } },
  { id: "desktop", width: 1920, height: 1080, image_size: { width: 1920, height: 1080 } },
  { id: "square",  width: 1440, height: 1440, image_size: { width: 1440, height: 1440 } }
];

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function generateImage(prompt, image_size){
  // fal.ai queue API for Flux — schnell is the fast/cheap tier, good enough for
  // most wallpapers. Swap the model path below for flux/dev or flux-pro/v1.1
  // for higher quality on hero pieces.
  const res = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: { "Authorization": `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, image_size, num_images: 1 })
  });
  if(!res.ok) throw new Error(`fal.ai request failed: HTTP ${res.status} — ${await res.text()}`);
  const queued = await res.json();

  // Poll until the generation finishes.
  const statusUrl = queued.status_url;
  let result = null;
  for(let i=0; i<40; i++){
    await sleep(1500);
    const statusRes = await fetch(statusUrl, { headers: { "Authorization": `Key ${FAL_KEY}` } });
    const status = await statusRes.json();
    if(status.status === "COMPLETED"){
      const resultRes = await fetch(queued.response_url, { headers: { "Authorization": `Key ${FAL_KEY}` } });
      result = await resultRes.json();
      break;
    }
    if(status.status === "FAILED") throw new Error("fal.ai generation failed");
  }
  if(!result) throw new Error("Timed out waiting for fal.ai generation");
  return result.images[0].url; // fal.ai hosts the raw output at this URL
}

async function uploadToSupabase(imageUrl, storagePath){
  const imgRes = await fetch(imageUrl);
  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const { error } = await sb.storage.from("wallpapers").upload(storagePath, buffer, {
    contentType: "image/png",
    upsert: true
  });
  if(error) throw new Error(`Supabase upload failed: ${error.message}`);
  const { data } = sb.storage.from("wallpapers").getPublicUrl(storagePath);
  return data.publicUrl;
}

async function main(){
  const fs = await import("node:fs/promises");
  let niches = JSON.parse(await fs.readFile(new URL("./priority-niches.json", import.meta.url)));
  if(ONLY) niches = niches.filter(n => ONLY.includes(n.catId));

  console.log(`Generating ${COUNT_PER_NICHE} concept(s) x 3 ratios for ${niches.length} niche(s)...\n`);

  let created = 0, failed = 0;
  for(const niche of niches){
    for(let v=0; v<COUNT_PER_NICHE; v++){
      const conceptSlug = `${niche.catId}-${v}`;
      const styleModifier = v === 0 ? "" : `, alternate composition and angle, variation ${v+1}`;
      const prompt = `${niche.promptBase}${styleModifier}, wallpaper composition, no people, no faces, no logos`;

      for(const ratio of RATIOS){
        const slug = `${conceptSlug}-${ratio.id}`;
        process.stdout.write(`  ${slug}... `);
        try{
          const { data: existing } = await sb.from("wallpapers").select("id").eq("slug", slug).maybeSingle();
          if(existing){ console.log("already exists, skipping"); continue; }

          const rawUrl = await generateImage(prompt, ratio.image_size);
          const storagePath = `${niche.catId}/${slug}.png`;
          const publicUrl = await uploadToSupabase(rawUrl, storagePath);

          const { error } = await sb.from("wallpapers").insert({
            slug,
            title: `${niche.label} ${["I","II","III","IV","V"][v] || v+1}`,
            category_id: niche.catId,
            category_label: niche.label,
            category_group: niche.group,
            mood: niche.mood,
            colors: niche.colors,
            aspect_ratio: ratio.id,
            width: ratio.width,
            height: ratio.height,
            image_url: publicUrl,
            storage_path: storagePath,
            prompt,
            status: "published"
          });
          if(error) throw new Error(error.message);

          console.log("done");
          created++;
        }catch(err){
          console.log(`FAILED — ${err.message}`);
          failed++;
        }
        await sleep(500); // stay polite to the API
      }
    }
  }

  console.log(`\nDone. ${created} wallpapers created, ${failed} failed.`);
  console.log("Refresh wallrank.club — real wallpapers should now appear alongside the gradient placeholders.");
}

main();
