This folder is where you drop wallpapers you've generated yourself with a free
tool (Google Gemini, Bing Image Creator, Leonardo.ai, etc.) before publishing
them with `scripts/sync-local-wallpapers.mjs`. See the README for the full
workflow.

Structure:

to-upload/
  galaxy/
    concept1-phone.png
    concept1-desktop.png
    concept1-square.png
  y2k/
    concept1-phone.png
    ...

- Folder name = category id (see js/data.js CATEGORY_GROUPS or
  scripts/priority-niches.json for valid ids).
- Filename must end in -phone, -desktop, -square, -tablet, or -ultrawide.

This folder itself isn't committed to git (see .gitignore) — only the images'
final published URLs (stored in Supabase after syncing) matter to the live site.
