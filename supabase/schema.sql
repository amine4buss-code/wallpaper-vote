-- WallRank database schema
-- Run this once in Supabase: Project → SQL Editor → New query → paste all of this → Run

-- ============ TABLES ============

-- One row per wallpaper, tracking real view/download counts.
-- wallpaper_id is a stable text slug (e.g. "mountains-0"), not the numeric id
-- used in the browser session, since that numeric id can shift as the catalog grows.
create table if not exists wallpaper_stats (
  wallpaper_id text primary key,
  views bigint not null default 0,
  downloads bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- One row per "help us improve" vote. Kept as individual rows (not just a
-- running tally) so you can look at trends over time later if you want to.
create table if not exists feedback (
  id bigint generated always as identity primary key,
  wallpaper_id text not null,
  vote text not null check (vote in ('yes','no')),
  created_at timestamptz not null default now()
);

-- Optional: custom wallpaper requests, in case you later want these stored
-- instead of (or in addition to) the mailto: form.
create table if not exists custom_requests (
  id bigint generated always as identity primary key,
  name text,
  email text,
  request_type text,
  description text,
  created_at timestamptz not null default now()
);

-- ============ ROW LEVEL SECURITY ============
-- Public (anon) visitors can READ stats, but cannot write to these tables
-- directly. Writes only happen through the functions below, which run with
-- elevated privileges — this stops anyone from opening dev tools and editing
-- the database directly through the public API.

alter table wallpaper_stats enable row level security;
alter table feedback enable row level security;
alter table custom_requests enable row level security;

create policy "public can read stats" on wallpaper_stats
  for select using (true);

-- feedback and custom_requests are write-only from the public side (via
-- functions below) and not readable by anon — no public read policy needed.

-- ============ FUNCTIONS ============
-- security definer = runs with the privileges of the function owner, so it
-- can write to the table even though anon has no direct write policy above.

create or replace function increment_view(p_wallpaper_id text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into wallpaper_stats (wallpaper_id, views)
  values (p_wallpaper_id, 1)
  on conflict (wallpaper_id)
  do update set views = wallpaper_stats.views + 1, updated_at = now();
$$;

create or replace function increment_download(p_wallpaper_id text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into wallpaper_stats (wallpaper_id, downloads)
  values (p_wallpaper_id, 1)
  on conflict (wallpaper_id)
  do update set downloads = wallpaper_stats.downloads + 1, updated_at = now();
$$;

create or replace function submit_feedback(p_wallpaper_id text, p_vote text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into feedback (wallpaper_id, vote) values (p_wallpaper_id, p_vote);
$$;

create or replace function submit_custom_request(p_name text, p_email text, p_type text, p_description text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into custom_requests (name, email, request_type, description)
  values (p_name, p_email, p_type, p_description);
$$;

-- Let the public (anon) role call these functions.
grant execute on function increment_view(text) to anon;
grant execute on function increment_download(text) to anon;
grant execute on function submit_feedback(text, text) to anon;
grant execute on function submit_custom_request(text, text, text, text) to anon;
