# WallRank

Free wallpapers, filtered by mood and color, previewed on your real device, and turned into a profile picture — with a quiz that recommends one for you.

## Project structure

```
wallrank-club/
├── index.html          # page markup
├── css/
│   └── styles.css      # all styling
├── js/
│   ├── config.js         # Supabase URL + public anon key (fill this in — see below)
│   ├── data.js            # moods, colors, dimensions, category taxonomy, wallpaper generation, devices
│   └── app.js             # state + all UI logic (gallery, modals, room demo, puzzle, stats, database calls)
├── supabase/
│   ├── schema.sql          # run once — stats/feedback tables
│   └── schema-content.sql  # run once — real wallpaper catalog table + storage bucket
├── scripts/
│   ├── priority-niches.json         # research-informed batch of niches + prompt ideas
│   ├── sync-local-wallpapers.mjs    # free path — publish your own generated images
│   └── generate-wallpapers.mjs      # optional paid path — automate bulk generation via fal.ai
├── to-upload/            # drop your free-tool-generated images here (see Option A below)
├── .env.example         # template for local secrets used only by the scripts above
├── assets/
│   └── wallpapers/      # unused for now — real images live in Supabase Storage instead
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

## Setting up the real database (Supabase)

The site now talks to a real Postgres database for views, downloads, and "help us improve" feedback — no more numbers resetting on refresh.

1. Create a free project at [supabase.com](https://supabase.com).
2. In your new project: **SQL Editor → New query** → paste the entire contents of `supabase/schema.sql` → **Run**. This creates the tables and the secure functions the site calls.
3. In **Project Settings → API**, copy your **Project URL** and **anon public key**.
4. Open `js/config.js` and paste them in place of the two placeholder strings.
5. Commit and push. The site is now recording real activity.

**Important:** only ever put the `anon` key in `js/config.js`. The `service_role` key (shown on the same page) has full admin access and must never go in this repo — the anon key is the only one designed to be public.

If `js/config.js` is left with the placeholder values, the site still works exactly as before — it just doesn't persist stats anywhere (silent no-op, logged to the browser console).

## Getting real wallpapers onto the site

The site ships with 117 mapped niches. A curated starter batch of 20 (`scripts/priority-niches.json`) is prioritized based on actual current wallpaper trend research (kawaii, Y2K, dark/AMOLED, galaxy, cyberpunk, cottagecore, etc.) — not guessed.

**Important limitation, stated plainly:** one AI generation produces one image at one resolution. There's no such thing as "one image, perfect at every possible size." So every concept should be made at **three fixed, honest aspect ratios** — phone (1080×1920), desktop (1920×1080), and square (1440×1440) — so they feel like a matched set instead of a stretched crop.

There are two ways to actually generate the images. Start with the free one.

### Option A — Free: generate manually, publish with one script

1. Generate wallpapers yourself with any free tool — [Google Gemini](https://gemini.google.com), [Bing Image Creator](https://www.bing.com/images/create), Leonardo.ai's free daily credits, etc. Use `scripts/priority-niches.json` for prompt ideas (the `promptBase` field per niche) — copy/adapt them into whichever tool you're using. Generate each concept 3 times at 3 aspect ratios (most of these tools let you pick portrait/landscape/square).
2. Save the files into a `to-upload/` folder at the project root, following this structure (see `to-upload/README.md`):
   ```
   to-upload/
     galaxy/
       concept1-phone.png
       concept1-desktop.png
       concept1-square.png
   ```
3. One-time setup: In Supabase, **SQL Editor → New query** → paste all of `supabase/schema-content.sql` → **Run**. Then copy `.env.example` to `.env` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API — this is a real secret, `.env` is already git-ignored, never commit it). Then `npm install`.
4. Publish:
   ```bash
   npm run sync
   ```
   This uploads your images to Supabase Storage and adds them to the live catalog — no AI API, no cost beyond Supabase's free tier. Re-running is safe; it skips anything already published. Refresh wallrank.club afterward to see them.

### Option B — Paid: automate bulk generation with fal.ai

Only worth it once you know the free workflow produces wallpapers you're happy with and want to generate at volume without manually saving each file. Costs roughly $0.003–0.01/image (verify current pricing at signup).

1. Free account at [fal.ai](https://fal.ai) → API key from Settings → API Keys.
2. Add `FAL_KEY=your_key` to the same `.env` file from Option A.
3. Run:
   ```bash
   npm run generate                                                  # 1 concept per niche (60 images total)
   node --env-file=.env scripts/generate-wallpapers.mjs --count=3    # 3 concepts per niche
   node --env-file=.env scripts/generate-wallpapers.mjs --only=galaxy,y2k  # just specific niches
   ```

Either option writes to the same `wallpapers` table, so you can mix and match — some niches by hand, some automated later.

**Ongoing research:** the priority list should evolve — check what's trending periodically (Pinterest wallpaper boards, Google Trends for specific aesthetic keywords) and add new entries to `scripts/priority-niches.json` rather than generating blindly across all 117 niches at once.

## Current state (what's real vs. simulated)

- Wallpapers start as CSS/canvas gradients (`js/data.js` → `PALETTES`). Real wallpapers (from either option above) layer on top automatically — queried live from Supabase, not a static file.
- Views, downloads, and "help us improve" feedback write to Supabase in real time once `js/config.js` is filled in (see above). Until then, they're 0 and don't persist.
- "Ask for a wallpaper" opens the visitor's email client via `mailto:` **and** saves a backup copy to the `custom_requests` table, so nothing is lost if their email client isn't configured.
- The full category taxonomy (19 groups, 117 niches) is mapped in `js/data.js` → `CATEGORY_GROUPS`. A category shows as "Coming soon" until at least one wallpaper exists for it — this is checked live against actual wallpaper data, not a static flag.

## Next steps

1. **Run the generation pipeline** (see above) to get real wallpapers live.
2. **Review feedback and requests periodically** — in Supabase, **Table Editor → feedback** and **Table Editor → custom_requests** show everything visitors have submitted.
3. **Individual wallpaper pages** — once there's real inventory, each wallpaper can get its own crawlable URL (currently everything lives in one `index.html`, nothing is indexed by Google yet). This is the next architectural step once content exists to justify it.

## Credits

Built as a prototype, structured for a real GitHub repo and iterative development.
