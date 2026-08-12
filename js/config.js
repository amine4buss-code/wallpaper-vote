/**
 * Supabase connection config.
 *
 * SUPABASE_ANON_KEY here is the PUBLIC "anon" key from Project Settings → API.
 * It is safe to commit and safe to have visible in the browser — that's what
 * it's designed for. Never put the "service_role" key here or anywhere in
 * this repo; that one is a full-access admin key and must stay private.
 *
 * Fill these in after creating your Supabase project, then commit + push.
 */
const SUPABASE_URL = "https://svrroicqugucdgttidgr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Fy3Jvq7RJSeaKkUGgwvusw_NZEExPmR";

// Creates the shared client other scripts use (window.sb). If the keys above
// haven't been filled in yet, this safely does nothing — the site still works,
// it just won't record real stats until this is configured.
if (SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20 && window.supabase) {
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase not configured yet — edit js/config.js with your project URL and anon key.");
}
