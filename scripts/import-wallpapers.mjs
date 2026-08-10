#!/usr/bin/env node
/**
 * Pulls real wallpapers from Pexels for every niche in niches.json,
 * and auto-tags each photo's color from its real dominant color (Pexels
 * returns this per-photo) instead of guessing. Mood stays tied to the
 * niche, which is intentional — mood is a curated call, color isn't.
 *
 * Usage:
 *   PEXELS_API_KEY=your_key_here node scripts/import-wallpapers.mjs
 *   PEXELS_API_KEY=your_key_here node scripts/import-wallpapers.mjs --per-niche=5
 *
 * Get a free key at https://www.pexels.com/api/  (200 req/hour, 20k/month)
 * Output: data/photos.json  (site loads this on top of the gradient fallback)
 */

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("Missing PEXELS_API_KEY. Get a free one at https://www.pexels.com/api/ and run:\n  PEXELS_API_KEY=xxxx node scripts/import-wallpapers.mjs");
  process.exit(1);
}

const perNicheArg = process.argv.find(a => a.startsWith("--per-niche="));
const PER_NICHE = perNicheArg ? parseInt(perNicheArg.split("=")[1], 10) : 3;
const DELAY_MS = 250; // stay well under Pexels rate limit

// Reference palette to snap each photo's real avg_color to one of our filter swatches.
const COLOR_SWATCHES = {
  red:"#c1272d", orange:"#e07a2b", gold:"#e0a458", yellow:"#e8d24a",
  green:"#4c9a6a", teal:"#2f9c95", blue:"#3b6fb0", purple:"#7b4fb5",
  pink:"#d76a9b", black:"#161616", white:"#f0ede4", gray:"#8a8a8a",
  brown:"#7a5237", neon:"#39ffcb"
};
function hexToRgb(hex){ const n = parseInt(hex.replace("#",""),16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function nearestColor(hex){
  const [r,g,b] = hexToRgb(hex);
  let best=null, bestDist=Infinity;
  for(const [id,swHex] of Object.entries(COLOR_SWATCHES)){
    const [sr,sg,sb] = hexToRgb(swHex);
    const dist = (r-sr)**2 + (g-sg)**2 + (b-sb)**2;
    if(dist < bestDist){ bestDist = dist; best = id; }
  }
  return best;
}

const DIMENSIONS = ["phone","desktop","square","ultrawide","tablet"];

async function fetchNiche(niche){
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(niche.query)}&per_page=${PER_NICHE}&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if(!res.ok){
    console.warn(`  ! ${niche.id}: HTTP ${res.status} — skipping`);
    return [];
  }
  const data = await res.json();
  return (data.photos || []).map((p, i) => ({
    id: `${niche.id}-${p.id}`,
    catId: niche.id,
    catLabel: niche.label,
    group: niche.group,
    name: `${niche.label} ${["I","II","III","IV","V"][i] || i+1}`,
    mood: niche.mood,
    colors: [nearestColor(p.avg_color || "#808080")],
    nativeDim: DIMENSIONS[i % DIMENSIONS.length],
    photo: p.src.large2x,
    photoSmall: p.src.medium,
    width: p.width,
    height: p.height,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
    sourceUrl: p.url
  }));
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function main(){
  const fs = await import("node:fs/promises");
  const niches = JSON.parse(await fs.readFile(new URL("./niches.json", import.meta.url)));
  console.log(`Importing ${PER_NICHE} photo(s) each for ${niches.length} niches from Pexels...\n`);

  const all = [];
  for(const niche of niches){
    process.stdout.write(`  fetching "${niche.query}"... `);
    try{
      const photos = await fetchNiche(niche);
      all.push(...photos);
      console.log(`${photos.length} found`);
    }catch(err){
      console.log(`error: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  await fs.mkdir(new URL("../data/", import.meta.url), { recursive: true });
  await fs.writeFile(new URL("../data/photos.json", import.meta.url), JSON.stringify(all, null, 2));
  console.log(`\nDone. ${all.length} real wallpapers written to data/photos.json`);
  console.log("Commit that file and your live site will pick up real photos automatically.");
}

main();
