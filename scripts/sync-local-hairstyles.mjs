#!/usr/bin/env node
/**
 * Publishes hairstyle reference images you generated yourself to the live
 * database. Separate from the wallpaper sync script on purpose — no aspect
 * ratio detection needed here, hairstyles are single reference photos, not
 * multi-dimension wallpapers.
 *
 * FOLDER CONVENTION:
 *   to-upload-hairstyles/
 *     bob/
 *       any-filename-works.jpg
 *       another-one.png
 *     pixie/
 *       photo1.jpg
 *
 * Rules:
 *  - Top-level folder name = the style id (must match an id in
 *    scripts/hairstyle-styles.json — that's where label/length/texture/
 *    hairColor/forWhom come from).
 *  - Filenames can be anything — no naming convention required, unlike the
 *    wallpaper script.
 *
 * Requires (same .env as the wallpaper scripts):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node --env-file=.env scripts/sync-local-hairstyles.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const UPLOAD_DIR = new URL("../to-upload-hairstyles/", import.meta.url);
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function contentTypeFor(filename){
  const ext = path.extname(filename).toLowerCase();
  if(ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if(ext === ".webp") return "image/webp";
  return "image/png";
}

async function main(){
  const styles = JSON.parse(await fs.readFile(new URL("./hairstyle-styles.json", import.meta.url)));
  const styleMap = {};
  styles.forEach(s => { styleMap[s.styleId] = s; });

  let styleFolders;
  try{
    styleFolders = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
  }catch(e){
    console.error(`Couldn't find "to-upload-hairstyles" folder next to this script.\nCreate it with one subfolder per style (see scripts/hairstyle-styles.json for valid style ids).\n(${e.message})`);
    process.exit(1);
  }

  let created = 0, skipped = 0, failed = 0;

  for(const entry of styleFolders){
    if(!entry.isDirectory()) continue;
    const styleId = entry.name;
    const info = styleMap[styleId];
    if(!info){
      console.log(`SKIPPED folder "${styleId}" — not found in scripts/hairstyle-styles.json. Add it there first, or check the folder name for a typo.`);
      continue;
    }

    const styleDir = new URL(`${styleId}/`, UPLOAD_DIR);
    const files = (await fs.readdir(styleDir)).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

    let conceptNum = 1;
    for(const filename of files){
      const slug = `${styleId}-${conceptNum}`;
      process.stdout.write(`  ${styleId}/${filename}... `);
      try{
        const { data: existing } = await sb.from("hairstyles").select("id").eq("slug", slug).maybeSingle();
        if(existing){ console.log("already published, skipping"); skipped++; conceptNum++; continue; }

        const filePath = new URL(filename, styleDir);
        const buffer = await fs.readFile(filePath);
        const storagePath = `${styleId}/${filename}`;

        const { error: uploadError } = await sb.storage.from("hairstyles").upload(storagePath, buffer, {
          contentType: contentTypeFor(filename),
          upsert: true
        });
        if(uploadError) throw new Error(`upload failed: ${uploadError.message}`);

        const { data: urlData } = sb.storage.from("hairstyles").getPublicUrl(storagePath);

        const { error: insertError } = await sb.from("hairstyles").insert({
          slug,
          title: `${info.label} ${ROMAN[conceptNum-1] || conceptNum}`,
          style_id: styleId,
          style_label: info.label,
          length: info.length,
          texture: info.texture,
          hair_color: info.hairColor,
          for_whom: info.forWhom,
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
      conceptNum++;
    }
  }

  console.log(`\nDone. ${created} published, ${skipped} skipped, ${failed} failed.`);
  console.log("Refresh wallrank.club to see them live under the Hairstyles tab.");
}

main();
