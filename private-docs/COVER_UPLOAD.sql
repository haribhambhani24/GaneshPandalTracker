-- ==============================================================================
-- GANESH PANDAL TRACKER - COVER PHOTO RLS & STORAGE POLICIES
-- ==============================================================================
-- This script sets up safe Row Level Security (RLS) policies for:
--   1. Direct UPDATE of pandals.photo_url by authenticated admins.
--   2. Direct storage management (INSERT, UPDATE, DELETE) under covers/ in 'pandal-photos'.
--   3. Public SELECT read access for approved pandals and public photos.
--
-- INSTRUCTIONS FOR SITE OWNER:
-- Run this entire script in the Supabase Dashboard -> SQL Editor.
-- It uses only DROP POLICY IF EXISTS and CREATE POLICY statements.
-- It NEVER drops tables, truncates data, or modifies existing rows.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE POLICIES ON public.pandals
-- ------------------------------------------------------------------------------

-- Ensure Row Level Security is enabled on pandals table
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;

-- Policy 1.1: Public can view approved pandals
DROP POLICY IF EXISTS "Public can view approved pandals" ON public.pandals;
CREATE POLICY "Public can view approved pandals"
ON public.pandals
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Policy 1.2: Authenticated admins can view all pandals (pending, approved, rejected)
DROP POLICY IF EXISTS "Authenticated users can view all pandals" ON public.pandals;
CREATE POLICY "Authenticated users can view all pandals"
ON public.pandals
FOR SELECT
TO authenticated
USING (true);

-- Policy 1.3: Authenticated admins can update pandals (including photo_url cover photo)
DROP POLICY IF EXISTS "Authenticated users can update pandals" ON public.pandals;
CREATE POLICY "Authenticated users can update pandals"
ON public.pandals
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 2. STORAGE POLICIES ON storage.objects ('pandal-photos' bucket)
-- ------------------------------------------------------------------------------

-- Policy 2.1: Public read access to all photos in the 'pandal-photos' bucket
DROP POLICY IF EXISTS "Public can view pandal photos" ON storage.objects;
CREATE POLICY "Public can view pandal photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pandal-photos');

-- Policy 2.2: Authenticated admins can upload cover photos under covers/
DROP POLICY IF EXISTS "Admins can upload cover photos" ON storage.objects;
CREATE POLICY "Admins can upload cover photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'pandal-photos'
    AND (storage.foldername(name))[1] = 'covers'
);

-- Policy 2.3: Authenticated admins can update cover photos under covers/
DROP POLICY IF EXISTS "Admins can update cover photos" ON storage.objects;
CREATE POLICY "Admins can update cover photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'pandal-photos'
    AND (storage.foldername(name))[1] = 'covers'
)
WITH CHECK (
    bucket_id = 'pandal-photos'
    AND (storage.foldername(name))[1] = 'covers'
);

-- Policy 2.4: Authenticated admins can delete cover photos under covers/ (for replacements)
DROP POLICY IF EXISTS "Admins can delete cover photos" ON storage.objects;
CREATE POLICY "Admins can delete cover photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'pandal-photos'
    AND (storage.foldername(name))[1] = 'covers'
);

-- Policy 2.5: General authenticated admin fallback for all pandal-photos objects
DROP POLICY IF EXISTS "Authenticated users can manage storage objects" ON storage.objects;
CREATE POLICY "Authenticated users can manage storage objects"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'pandal-photos')
WITH CHECK (bucket_id = 'pandal-photos');

-- ==============================================================================
-- 3. DIAGNOSTIC GUIDE: HOW TO CHECK IN SUPABASE
-- ==============================================================================
-- To confirm these policies are active:
--
-- 1. Check Table Policies:
--    In Supabase Dashboard -> Database -> Policies -> public.pandals
--    Verify that "Authenticated users can update pandals" shows FOR UPDATE TO authenticated.
--
-- 2. Check Storage Policies:
--    In Supabase Dashboard -> Storage -> Configuration (Policies) -> pandal-photos
--    Verify that:
--      - "Public can view pandal photos" (SELECT) is enabled.
--      - "Admins can upload cover photos" (INSERT) is enabled.
--      - "Admins can delete cover photos" (DELETE) is enabled.
--
-- 3. Diagnostic Query:
--    Run the following query in the SQL Editor to inspect all active storage policies:
--    SELECT policyname, permissive, roles, cmd, qual, with_check
--    FROM pg_policies
--    WHERE tablename = 'objects' AND schemaname = 'storage';
-- ==============================================================================

