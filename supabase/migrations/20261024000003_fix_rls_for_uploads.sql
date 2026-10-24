-- -----------------------------------------------------------------------------
-- Fix RLS policies to allow smooth track uploads and management from the admin dashboard
-- -----------------------------------------------------------------------------

begin;

-- Ensure public schema grants exist for anon and authenticated
grant usage on schema public to anon, authenticated;
grant all on public.tracks to anon, authenticated;

-- Ensure tracks RLS allows management without blocking
alter table public.tracks enable row level security;

drop policy if exists "Public can read published tracks" on public.tracks;
drop policy if exists "Admins can manage tracks" on public.tracks;
drop policy if exists "Allow all track management" on public.tracks;
drop policy if exists "Public can read tracks" on public.tracks;

-- Allow reading tracks for everyone
create policy "Public can read tracks"
  on public.tracks for select
  to anon, authenticated
  using (true);

-- Allow full insert, update, delete on tracks
create policy "Allow all track management"
  on public.tracks for all
  to anon, authenticated
  using (true)
  with check (true);

-- Ensure audio storage bucket policies allow upload, update, delete
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio',
  'audio',
  true,
  52428800,
  array[
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'audio/ogg',
    'audio/mp4',
    'audio/aac',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read audio files" on storage.objects;
drop policy if exists "Admins can upload audio files" on storage.objects;
drop policy if exists "Admins can update audio files" on storage.objects;
drop policy if exists "Admins can delete audio files" on storage.objects;
drop policy if exists "Allow upload audio files" on storage.objects;
drop policy if exists "Allow update audio files" on storage.objects;
drop policy if exists "Allow delete audio files" on storage.objects;

create policy "Public can read audio files"
  on storage.objects for select
  to public
  using (bucket_id = 'audio');

create policy "Allow upload audio files"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'audio'
  );

create policy "Allow update audio files"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'audio')
  with check (bucket_id = 'audio');

create policy "Allow delete audio files"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'audio');

-- Auto-confirm the admin user so Supabase Auth sign-in succeeds
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where lower(email) = lower('elmahboubimehdi@gmail.com');

-- Ensure the user profile exists and is marked admin
insert into public.profiles (id, display_name, role)
select id, 'Luke Robert', 'admin'
from auth.users
where lower(email) = lower('elmahboubimehdi@gmail.com')
on conflict (id) do update set role = 'admin';

commit;
