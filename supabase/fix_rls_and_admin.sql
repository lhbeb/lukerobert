-- =============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO SOLVE ALL RLS AND AUTH ISSUES
-- =============================================================================

BEGIN;

-- 1. Confirm your admin account email (confirmed_at is generated automatically)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE lower(email) = lower('elmahboubimehdi@gmail.com');

-- 2. Assign admin role in public profiles
INSERT INTO public.profiles (id, display_name, role)
SELECT id, 'Luke Robert', 'admin'
FROM auth.users
WHERE lower(email) = lower('elmahboubimehdi@gmail.com')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 3. Disable RLS on tracks so uploads and insertions NEVER get blocked
ALTER TABLE public.tracks DISABLE ROW LEVEL SECURITY;

-- 4. Allow unrestricted upload and deletion on the 'audio' storage bucket
DROP POLICY IF EXISTS "Public and Admin upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Public and Admin delete audio" ON storage.objects;
DROP POLICY IF EXISTS "Public and Admin update audio" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Audio" ON storage.objects;

CREATE POLICY "Public Access Audio"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'audio');

CREATE POLICY "Public and Admin upload audio"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Public and Admin update audio"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'audio')
WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Public and Admin delete audio"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'audio');

COMMIT;
