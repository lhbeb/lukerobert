-- Luke Robert: complete RLS policy pass
--
-- Run this after 20261023000000_luke_robert_audio_library.sql.
-- It is safe to run more than once because policies are recreated by name.
--
-- Admin setup, performed by the project owner/service role after creating a
-- Supabase Auth user:
--   update public.profiles
--   set role = 'admin'
--   where id = 'AUTH_USER_UUID';

begin;

-- -----------------------------------------------------------------------------
-- The admin predicate used by every table and storage policy
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles as profile
    where profile.id = auth.uid()
      and profile.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.audio_packs enable row level security;
alter table public.audio_pack_tracks enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.download_events enable row level security;

-- Profiles: users can read/update themselves, while admins can manage roles.
drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'user');

create policy "Admins can manage profiles"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Free/published tracks are public. Drafts and private tracks are admin-only.
drop policy if exists "Public can read published tracks" on public.tracks;
drop policy if exists "Admins can manage tracks" on public.tracks;

create policy "Public can read published tracks"
  on public.tracks for select
  to anon, authenticated
  using (is_published = true or public.is_admin());

create policy "Admins can manage tracks"
  on public.tracks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Published pack metadata is public. Pack management is admin-only.
drop policy if exists "Public can read published packs" on public.audio_packs;
drop policy if exists "Admins can manage packs" on public.audio_packs;

create policy "Public can read published packs"
  on public.audio_packs for select
  to anon, authenticated
  using (is_published = true or public.is_admin());

create policy "Admins can manage packs"
  on public.audio_packs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Pack membership is visible only for published packs, or to admins.
drop policy if exists "Public can read tracks in published packs" on public.audio_pack_tracks;
drop policy if exists "Admins can manage pack tracks" on public.audio_pack_tracks;

create policy "Public can read tracks in published packs"
  on public.audio_pack_tracks for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.audio_packs as pack
      where pack.id = audio_pack_tracks.pack_id
        and (pack.is_published = true or public.is_admin())
    )
  );

create policy "Admins can manage pack tracks"
  on public.audio_pack_tracks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Newsletter: anonymous visitors may subscribe, but nobody can read the list
-- except an admin.
drop policy if exists "Anyone can subscribe to the newsletter" on public.newsletter_subscribers;
drop policy if exists "Admins can manage newsletter subscribers" on public.newsletter_subscribers;

create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (status = 'subscribed');

create policy "Admins can manage newsletter subscribers"
  on public.newsletter_subscribers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Downloads: visitors can append a valid event, but only admins can read it.
drop policy if exists "Anyone can record a download" on public.download_events;
drop policy if exists "Admins can read download events" on public.download_events;

create policy "Anyone can record a download"
  on public.download_events for insert
  to anon, authenticated
  with check (
    track_id is null
    or exists (
      select 1
      from public.tracks as track
      where track.id = download_events.track_id
        and track.is_published = true
    )
  );

create policy "Admins can read download events"
  on public.download_events for select
  to authenticated
  using (public.is_admin());

-- Keep API privileges aligned with the policies above.
grant usage on schema public to anon, authenticated;
grant select on public.tracks, public.audio_packs, public.audio_pack_tracks
  to anon, authenticated;
grant insert, update, delete on public.tracks, public.audio_packs, public.audio_pack_tracks
  to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant insert on public.newsletter_subscribers, public.download_events
  to anon, authenticated;
grant select, update, delete on public.newsletter_subscribers to authenticated;
grant select on public.download_events to authenticated;
grant usage, select on sequence public.download_events_id_seq to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Storage RLS
-- -----------------------------------------------------------------------------

-- Free audio and legacy thumbnails are public; only admins can write.
drop policy if exists "Public can read audio files" on storage.objects;
drop policy if exists "Admins can upload audio files" on storage.objects;
drop policy if exists "Admins can update audio files" on storage.objects;
drop policy if exists "Admins can delete audio files" on storage.objects;

create policy "Public can read audio files"
  on storage.objects for select
  to public
  using (bucket_id = 'audio');

create policy "Admins can upload audio files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'audio'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('tracks', 'thumbnails')
  );

create policy "Admins can update audio files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'audio' and public.is_admin())
  with check (bucket_id = 'audio' and public.is_admin());

create policy "Admins can delete audio files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'audio' and public.is_admin());

-- Pack artwork is public; only admins can write it.
drop policy if exists "Public can read artwork files" on storage.objects;
drop policy if exists "Admins can upload artwork files" on storage.objects;
drop policy if exists "Admins can update artwork files" on storage.objects;
drop policy if exists "Admins can delete artwork files" on storage.objects;

create policy "Public can read artwork files"
  on storage.objects for select
  to public
  using (bucket_id = 'artwork');

create policy "Admins can upload artwork files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'artwork' and public.is_admin());

create policy "Admins can update artwork files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'artwork' and public.is_admin())
  with check (bucket_id = 'artwork' and public.is_admin());

create policy "Admins can delete artwork files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'artwork' and public.is_admin());

-- Paid audio is private. A server-side payment check must create signed URLs;
-- no anonymous or ordinary authenticated user gets direct object reads.
drop policy if exists "Admins can upload paid audio files" on storage.objects;
drop policy if exists "Admins can update paid audio files" on storage.objects;
drop policy if exists "Admins can delete paid audio files" on storage.objects;

create policy "Admins can upload paid audio files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'paid-audio' and public.is_admin());

create policy "Admins can update paid audio files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'paid-audio' and public.is_admin())
  with check (bucket_id = 'paid-audio' and public.is_admin());

create policy "Admins can delete paid audio files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'paid-audio' and public.is_admin());

commit;
