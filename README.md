# WallRank

Free wallpapers, filtered by mood and color, previewed on your real device, and turned into a profile picture — with a quiz that recommends one for you.

## Project structure

```
wallrank-club/
├── index.html          # page markup
├── css/
│   └── styles.css      # all styling
├── js/
│   ├── data.js          # moods, colors, dimensions, category taxonomy, wallpaper generation, devices
│   └── app.js           # state + all UI logic (gallery, modals, room demo, puzzle, stats...)
├── assets/
│   └── wallpapers/      # drop real wallpaper images here when ready (see "Using real images" below)
└── README.md
```

This is currently a static site — no build step, no dependencies. Open `index.html` in a browser, or serve it locally:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploying

Static hosting works out of the box:
- **GitHub Pages**: push this repo, enable Pages on the `main` branch, root folder.
- **Vercel / Netlify**: import the repo, no build command needed, output directory `/`.

## Adding real wallpapers (Pexels import pipeline)

The site ships with 117 mapped niches (`scripts/niches.json`) and a script that pulls real, licensed photos for every one of them from Pexels, auto-tagging color from each photo's actual dominant color instead of a guess:

```bash
# 1. Get a free key: https://www.pexels.com/api/  (200 req/hr, 20k/month)
# 2. Run the import (defaults to 3 photos per niche — ~117 x 3 = ~350 wallpapers)
PEXELS_API_KEY=your_key_here node scripts/import-wallpapers.mjs

# or pull more per niche:
PEXELS_API_KEY=your_key_here node scripts/import-wallpapers.mjs --per-niche=6
```

This writes `data/photos.json`. Commit it and the live site picks up real photos automatically on top of the gradient placeholders — niches without real photos yet just keep showing their gradient, nothing breaks. Photo credit (photographer name, linked) shows automatically in the preview modal per Pexels' attribution terms.

Re-run the script anytime to refresh the catalog with new photos.

## Current state (what's real vs. simulated)

- Wallpapers start as CSS/canvas gradients (`js/data.js` → `PALETTES`) and get real photos layered on top once you run the import script above.
- Views, downloads, and "help us improve" feedback live in memory (`js/app.js` → `state`) and reset on page reload. There's no database yet.
- "Ask for a wallpaper" opens the visitor's email client via a `mailto:` link pointed at `requests@wallrank.club` — update that address in `js/app.js` if needed.
- The full category taxonomy (19 groups, 117 niches) is mapped in both `js/data.js` → `CATEGORY_GROUPS` and `scripts/niches.json`. Any category with zero wallpapers shows as "Coming soon" on the Categories page — this now checks actual wallpaper presence, not a static flag, so it updates automatically as you import more photos.

## Next steps to make it a real product

1. **Run the import script** (above) to replace gradient placeholders with real photos across all 117 niches.
2. **A backend** — persist views, downloads, and improve-feedback in a real database (Postgres via Supabase/Neon is a fast path) instead of in-memory `state`. This needs API routes, which means moving off pure static hosting (e.g. a small Next.js or Express layer, or serverless functions on Vercel/Netlify).
3. **Custom request handling** — if `mailto:` isn't enough, add a real form submission (e.g. a serverless function that emails you or writes to a database).
4. **Rate limits at scale** — Pexels' free tier is 20k requests/month; if the catalog needs to grow well past a few thousand images, consider mixing in Unsplash's API too, or licensing a stock set directly.

## Credits

Built as a prototype, structured for a real GitHub repo and iterative development.
