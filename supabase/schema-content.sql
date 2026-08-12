-- WallRank content pipeline schema
-- Run this once in Supabase: Project → SQL Editor → New query → paste all of this → Run
-- (This is separate from schema.sql, which you should have already run for stats/feedback.)

-- ============ TABLE ============
-- The real wallpaper catalog. This replaces the gradient placeholders in
-- js/data.js over time — each row is one real, AI-generated wallpaper image.

create table if not exists wallpapers (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  category_id text not null,
  category_label text not null,
  category_group text not null,
  mood text not null,
  colors text[] not null default '{}',
  aspect_ratio text not null,        -- 'phone' | 'desktop' | 'square' | 'ultrawide' | 'tablet'
  width int not null,
  height int not null,
  image_url text not null,           -- public Supabase Storage URL
  storage_path text not null,        -- path within the bucket, for cleanup/regeneration
  prompt text,                       -- the exact prompt used, kept for reproducibility
  status text not null default 'published' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create index if not exists wallpapers_category_idx on wallpapers (category_id);
create index if not exists wallpapers_status_idx on wallpapers (status);

-- ============ ROW LEVEL SECURITY ============
-- Public (anon, i.e. every visitor's browser) can read PUBLISHED wallpapers only.
-- There is deliberately no public write policy — inserts only happen from the
-- generation script running on your own machine with the service_role key,
-- which bypasses RLS entirely. That key must never be in this repo or the browser.

alter table wallpapers enable row level security;

create policy "public can read published wallpapers" on wallpapers
  for select using (status = 'published');

-- ============ STORAGE ============
-- Run this in the SQL editor too — it's just SQL that configures Storage.
-- Creates a public bucket named "wallpapers" for the actual image files.

insert into storage.buckets (id, name, public)
values ('wallpapers', 'wallpapers', true)
on conflict (id) do nothing;

create policy "public can read wallpaper images" on storage.objects
  for select using (bucket_id = 'wallpapers');

-- No public insert/update/delete policy on storage.objects either — uploads
-- only happen via the generation script using the service_role key.
