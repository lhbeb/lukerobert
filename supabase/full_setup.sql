-- Luke Robert / Lukerobert.me complete Supabase setup
-- Run this entire file once in the Supabase SQL Editor.
--
-- This creates the schema, auth profile trigger, admin helper, table RLS,
-- storage buckets, storage RLS, and API grants used by the website.
-- After creating an Auth user, promote that user with the final query below.

begin;

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Shared trigger helper
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Profiles and Supabase Auth integration
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Luke Robert',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists profiles_role_idx on public.profiles(role);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Luke Robert')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Audio library tables
-- -----------------------------------------------------------------------------

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text,
  category text,
  kind text not null default 'music'
    check (kind in ('music', 'sound_effect', 'ambience', 'texture', 'pack_preview')),
  license text not null default 'creator_free',
  is_free boolean not null default true,
  is_published boolean not null default true,
  storage_bucket text not null default 'audio'
    check (storage_bucket in ('audio', 'paid-audio')),
  duration text,
  file_path text,
  file_url text not null,
  thumbnail_path text,
  thumbnail_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists tracks_created_at_idx on public.tracks(created_at desc);
create index if not exists tracks_category_idx on public.tracks(category);
create index if not exists tracks_kind_idx on public.tracks(kind);
create index if not exists tracks_published_idx on public.tracks(is_published, created_at desc);
create index if not exists tracks_free_idx on public.tracks(is_free, created_at desc);

drop trigger if exists tracks_set_updated_at on public.tracks;
create trigger tracks_set_updated_at
  before update on public.tracks
  for each row execute procedure public.set_updated_at();

create table if not exists public.audio_packs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  cover_image_path text,
  cover_image_url text,
  shop_url text,
  storage_bucket text not null default 'paid-audio'
    check (storage_bucket in ('audio', 'paid-audio')),
  price_cents integer check (price_cents is null or price_cents >= 0),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists audio_packs_published_idx
  on public.audio_packs(is_published, created_at desc);

create table if not exists public.audio_pack_tracks (
  pack_id uuid not null references public.audio_packs(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete cascade,
  position integer not null default 0 check (position >= 0),
  primary key (pack_id, track_id)
);

create index if not exists audio_pack_tracks_position_idx
  on public.audio_pack_tracks(pack_id, position);

drop trigger if exists audio_packs_set_updated_at on public.audio_packs;
create trigger audio_packs_set_updated_at
  before update on public.audio_packs
  for each row execute procedure public.set_updated_at();

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(trim(email))),
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed')),
  source text not null default 'website',
  subscribed_at timestamptz not null default timezone('utc', now()),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers(lower(email));

create table if not exists public.download_events (
  id bigint generated always as identity primary key,
  track_id uuid references public.tracks(id) on delete set null,
  session_id text,
  referrer text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists download_events_track_idx
  on public.download_events(track_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Table RLS
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.audio_packs enable row level security;
alter table public.audio_pack_tracks enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.download_events enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'user');

create policy "Admins can manage profiles"
  on public.profiles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read published tracks" on public.tracks;
drop policy if exists "Admins can manage tracks" on public.tracks;
create policy "Public can read published tracks"
  on public.tracks for select to anon, authenticated
  using (is_published = true or public.is_admin());
create policy "Admins can manage tracks"
  on public.tracks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read published packs" on public.audio_packs;
drop policy if exists "Admins can manage packs" on public.audio_packs;
create policy "Public can read published packs"
  on public.audio_packs for select to anon, authenticated
  using (is_published = true or public.is_admin());
create policy "Admins can manage packs"
  on public.audio_packs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read tracks in published packs" on public.audio_pack_tracks;
drop policy if exists "Admins can manage pack tracks" on public.audio_pack_tracks;
create policy "Public can read tracks in published packs"
  on public.audio_pack_tracks for select to anon, authenticated
  using (
    exists (
      select 1 from public.audio_packs as pack
      where pack.id = audio_pack_tracks.pack_id
        and (pack.is_published = true or public.is_admin())
    )
  );
create policy "Admins can manage pack tracks"
  on public.audio_pack_tracks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can subscribe to the newsletter" on public.newsletter_subscribers;
drop policy if exists "Admins can manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (status = 'subscribed');
create policy "Admins can manage newsletter subscribers"
  on public.newsletter_subscribers for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can record a download" on public.download_events;
drop policy if exists "Admins can read download events" on public.download_events;
create policy "Anyone can record a download"
  on public.download_events for insert to anon, authenticated
  with check (
    track_id is null or exists (
      select 1 from public.tracks as track
      where track.id = download_events.track_id
        and track.is_published = true
    )
  );
create policy "Admins can read download events"
  on public.download_events for select to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- API privileges
-- -----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on public.tracks, public.audio_packs, public.audio_pack_tracks to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant insert, update, delete on public.tracks, public.audio_packs, public.audio_pack_tracks to authenticated;
grant insert on public.newsletter_subscribers, public.download_events to anon, authenticated;
grant select, update, delete on public.newsletter_subscribers to authenticated;
grant select on public.download_events to authenticated;
grant usage, select on sequence public.download_events_id_seq to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Storage buckets and storage RLS
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio', 'audio', true, 52428800,
  array['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4',
        'audio/aac', 'image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artwork', 'artwork', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'paid-audio', 'paid-audio', false, 52428800,
  array['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4', 'audio/aac']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read audio files" on storage.objects;
drop policy if exists "Admins can upload audio files" on storage.objects;
drop policy if exists "Admins can update audio files" on storage.objects;
drop policy if exists "Admins can delete audio files" on storage.objects;
create policy "Public can read audio files"
  on storage.objects for select to public using (bucket_id = 'audio');
create policy "Admins can upload audio files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'audio' and public.is_admin()
    and (storage.foldername(name))[1] in ('tracks', 'thumbnails')
  );
create policy "Admins can update audio files"
  on storage.objects for update to authenticated
  using (bucket_id = 'audio' and public.is_admin())
  with check (bucket_id = 'audio' and public.is_admin());
create policy "Admins can delete audio files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'audio' and public.is_admin());

drop policy if exists "Public can read artwork files" on storage.objects;
drop policy if exists "Admins can upload artwork files" on storage.objects;
drop policy if exists "Admins can update artwork files" on storage.objects;
drop policy if exists "Admins can delete artwork files" on storage.objects;
create policy "Public can read artwork files"
  on storage.objects for select to public using (bucket_id = 'artwork');
create policy "Admins can upload artwork files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'artwork' and public.is_admin());
create policy "Admins can update artwork files"
  on storage.objects for update to authenticated
  using (bucket_id = 'artwork' and public.is_admin())
  with check (bucket_id = 'artwork' and public.is_admin());
create policy "Admins can delete artwork files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'artwork' and public.is_admin());

drop policy if exists "Admins can upload paid audio files" on storage.objects;
drop policy if exists "Admins can update paid audio files" on storage.objects;
drop policy if exists "Admins can delete paid audio files" on storage.objects;
create policy "Admins can upload paid audio files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'paid-audio' and public.is_admin());
create policy "Admins can update paid audio files"
  on storage.objects for update to authenticated
  using (bucket_id = 'paid-audio' and public.is_admin())
  with check (bucket_id = 'paid-audio' and public.is_admin());
create policy "Admins can delete paid audio files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'paid-audio' and public.is_admin());

commit;

-- -----------------------------------------------------------------------------
-- Run after creating your Auth user. Replace the email only.
-- This avoids guessing or manually copying a UUID.
-- -----------------------------------------------------------------------------
-- insert into public.profiles (id, display_name, role)
-- select id, 'Luke Robert', 'admin'
-- from auth.users
-- where lower(email) = lower('YOUR_SUPABASE_AUTH_EMAIL')
-- on conflict (id) do update set role = 'admin';
