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
│   └── schema.sql        # run once in Supabase's SQL Editor to create the database
├── assets/
│   └── wallpapers/      # drop real wallpaper images here when ready
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

## Current state (what's real vs. simulated)

- Wallpapers start as CSS/canvas gradients (`js/data.js` → `PALETTES`). Real photos/images can layer on top via `data/photos.json` — this mechanism is source-agnostic (built for Pexels originally, works the same for AI-generated images or your own uploads).
- Views, downloads, and "help us improve" feedback write to Supabase in real time once `js/config.js` is filled in (see above). Until then, they're 0 and don't persist.
- "Ask for a wallpaper" opens the visitor's email client via `mailto:` **and** saves a backup copy to the `custom_requests` table, so nothing is lost if their email client isn't configured.
- The full category taxonomy (19 groups, 117 niches) is mapped in `js/data.js` → `CATEGORY_GROUPS`. A category shows as "Coming soon" until at least one wallpaper exists for it — this is checked live against actual wallpaper data, not a static flag.

## Next steps

1. **Fill in `js/config.js`** with your Supabase keys (see above) — this is the last piece to make stats real.
2. **Real wallpaper content** — populate `data/photos.json` (any format matching what `mergeRealPhotos()` in `js/data.js` expects) with real images, sourced however you decide (AI-generated, licensed stock, your own work).
3. **Review feedback and requests periodically** — in Supabase, **Table Editor → feedback** and **Table Editor → custom_requests** show everything visitors have submitted.

## Credits

Built as a prototype, structured for a real GitHub repo and iterative development.
