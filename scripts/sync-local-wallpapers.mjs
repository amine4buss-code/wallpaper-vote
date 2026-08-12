#!/usr/bin/env node
/**
 * Publishes wallpapers you generated yourself (for free, with any tool —
 * Gemini, Bing Image Creator, Leonardo, whatever) to the live database.
 * No paid API involved — this only talks to your own free Supabase project.
 *
 * FOLDER CONVENTION:
 *   to-upload/
 *     galaxy/
 *       concept1-phone.png
 *       concept1-desktop.png
 *       concept1-square.png
 *       concept2-phone.png
 *       ...
 *     y2k/
 *       concept1-phone.png
 *       ...
 *
 * Rules:
 *  - Top-level folder name = the category id (must match an id in
 *    scripts/priority-niches.json, or js/data.js CATEGORY_GROUPS — check
 *    there for the full list of valid ids like "galaxy", "y2k", "mountains").
 *  - Filename must end in -phone, -desktop, -square, -tablet, or -ultrawide
 *    so the script knows which aspect ratio each image is.
 *  - Everything before that suffix (e.g. "concept1") groups the set together
 *    as one "concept" — doesn't need to be anything specific.
 *
 * Requires (same as the generation script, minus FAL_KEY — no AI API used here):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (local .env only, never commit this)
 *
 * Usage:
 *   node --env-file=.env scripts/sync-local-wallpapers.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error([
    "Missing environment variables. Set these in your .env file:",
    "  SUPABASE_URL",
    "  SUPABASE_SERVICE_ROLE_KEY   (Project Settings -> API -> service_role)",
    "",
    "Then run: node --env-file=.env scripts/sync-local-wallpapers.mjs"
  ].join("\n"));
  process.exit(1);
}

const UPLOAD_DIR = new URL("../to-upload/", import.meta.url);

const RATIO_SUFFIXES = {
  phone:      { width: 1080, height: 1920 },
  desktop:    { width: 1920, height: 1080 },
  square:     { width: 1440, height: 1440 },
  tablet:     { width: 1640, height: 2360 },
  ultrawide:  { width: 3440, height: 1440 }
};

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function loadNicheInfo(){
  // Pull labels/mood/colors from priority-niches.json first (it's richer),
  // falling back to a generic entry if a folder name isn't in that list —
  // so this still works for any of the other 117 niches, not just the 20.
  const fs2 = await import("node:fs/promises");
  const priority = JSON.parse(await fs2.readFile(new URL("./priority-niches.json", import.meta.url)));
  const map = {};
  priority.forEach(n => { map[n.catId] = { label: n.label, group: n.group, mood: n.mood, colors: n.colors }; });
  return map;
}

function contentTypeFor(filename){
  const ext = path.extname(filename).toLowerCase();
  if(ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if(ext === ".webp") return "image/webp";
  return "image/png";
}

async function main(){
  let catFolders;
  try{
    catFolders = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
  }catch(e){
    console.error(`Couldn't find a "to-upload" folder next to this script. Create it, add category subfolders, and try again.\n(${e.message})`);
    process.exit(1);
  }

  const nicheInfo = await loadNicheInfo();
  let created = 0, skipped = 0, failed = 0;

  for(const entry of catFolders){
    if(!entry.isDirectory()) continue;
    const catId = entry.name;
    const info = nicheInfo[catId] || { label: catId, group: "Uncategorized", mood: "Calm", colors: ["gray"] };
    if(!nicheInfo[catId]){
      console.log(`Note: "${catId}" isn't in priority-niches.json — using generic label/mood/colors. Add it there for better tagging.`);
    }

    const catDir = new URL(`${catId}/`, UPLOAD_DIR);
    const files = (await fs.readdir(catDir)).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

    for(const filename of files){
      const nameNoExt = filename.replace(/\.(png|jpe?g|webp)$/i, "");
      const ratioMatch = Object.keys(RATIO_SUFFIXES).find(r => nameNoExt.endsWith(`-${r}`));
      if(!ratioMatch){
        console.log(`  ! ${catId}/${filename} — filename must end in -phone, -desktop, -square, -tablet, or -ultrawide. Skipping.`);
        skipped++;
        continue;
      }
      const slug = `${catId}-${nameNoExt}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      process.stdout.write(`  ${catId}/${filename}... `);
      try{
        const { data: existing } = await sb.from("wallpapers").select("id").eq("slug", slug).maybeSingle();
        if(existing){ console.log("already published, skipping"); skipped++; continue; }

        const filePath = new URL(filename, catDir);
        const buffer = await fs.readFile(filePath);
        const storagePath = `${catId}/${filename}`;

        const { error: uploadError } = await sb.storage.from("wallpapers").upload(storagePath, buffer, {
          contentType: contentTypeFor(filename),
          upsert: true
        });
        if(uploadError) throw new Error(`upload failed: ${uploadError.message}`);

        const { data: urlData } = sb.storage.from("wallpapers").getPublicUrl(storagePath);

        const { error: insertError } = await sb.from("wallpapers").insert({
          slug,
          title: `${info.label} ${nameNoExt.replace(`-${ratioMatch}`, "")}`.trim(),
          category_id: catId,
          category_label: info.label,
          category_group: info.group,
          mood: info.mood,
          colors: info.colors,
          aspect_ratio: ratioMatch,
          width: RATIO_SUFFIXES[ratioMatch].width,
          height: RATIO_SUFFIXES[ratioMatch].height,
          image_url: urlData.publicUrl,
          storage_path: storagePath,
          status: "published"
        });
        if(insertError) throw new Error(`database insert failed: ${insertError.message}`);

        console.log("published");
        created++;
      }catch(err){
        console.log(`FAILED — ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\nDone. ${created} published, ${skipped} skipped, ${failed} failed.`);
  console.log("Refresh wallrank.club to see them live.");
}

main();
