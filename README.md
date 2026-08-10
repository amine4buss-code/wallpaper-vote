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

## Current state (what's real vs. simulated)

- Wallpapers are CSS/canvas gradients tagged by mood, color, and ~40 populated niches (`js/data.js` → `PALETTES` + `CATEGORY_GROUPS`) — not real photos yet.
- Views, downloads, and "help us improve" feedback live in memory (`js/app.js` → `state`) and reset on page reload. There's no database yet.
- "Ask for a wallpaper" opens the visitor's email client via a `mailto:` link pointed at `requests@wallrank.club` — update that address in `js/app.js` if needed.
- The full category taxonomy (19 groups, 100+ niches) is already mapped in `js/data.js` → `CATEGORY_GROUPS`. Any category without a `palette` key shows as "Coming soon" on the Categories page.

## Next steps to make it a real product

1. **Real images** — replace the generated gradients with actual wallpaper files. Two options:
   - Simple: store files in `assets/wallpapers/<category>/`, reference them by URL in `WALLPAPERS` (in `js/data.js`) instead of `bg` gradients.
   - Scalable: move to object storage (S3/Cloudflare R2) once the catalog grows past a few hundred images.
2. **A backend** — persist views, downloads, and improve-feedback in a real database (Postgres via Supabase/Neon is a fast path) instead of in-memory `state`. This needs API routes, which means moving off pure static hosting (e.g. a small Next.js or Express layer, or serverless functions on Vercel/Netlify).
3. **Add new wallpapers** — populate the remaining "Coming soon" niches in `CATEGORY_GROUPS` by adding entries to `WALLPAPERS`.
4. **Custom request handling** — if `mailto:` isn't enough, add a real form submission (e.g. a serverless function that emails you or writes to a database).

## Credits

Built as a prototype, structured for a real GitHub repo and iterative development.
