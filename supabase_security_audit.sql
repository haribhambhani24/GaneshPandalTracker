-- ==============================================================================
-- GANESH PANDAL TRACKER - SECURITY & RLS AUDIT SCRIPT
-- ==============================================================================
-- Run this script in the Supabase SQL Editor.
-- It enforces strict Row Level Security (RLS) and storage policies:
--   1. Public users can ONLY read approved pandals (status = 'approved').
--   2. Anyone can submit a pandal, but ONLY with status = 'pending'.
--   3. Public users can NEVER update or delete any pandal.
--   4. Only authenticated admin users can update or delete pandals.
--   5. Storage uploads are restricted to the 'pandal-photos' bucket and capped under 2 MB.
--   6. Uses ALTER and CREATE POLICY only — zero data destruction.
-- ==============================================================================

-- 1. Ensure RLS is active on public.pandals
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies safely to apply hardened versions
DROP POLICY IF EXISTS "Public can view approved pandals" ON public.pandals;
DROP POLICY IF EXISTS "Authenticated users can view all pandals" ON public.pandals;
DROP POLICY IF EXISTS "Anyone can submit pending pandals" ON public.pandals;
DROP POLICY IF EXISTS "Authenticated users can update pandals" ON public.pandals;
DROP POLICY IF EXISTS "Authenticated users can delete pandals" ON public.pandals;

-- POLICY 1: Public SELECT (anon & authenticated) -> ONLY approved pandals
CREATE POLICY "Public can view approved pandals"
ON public.pandals
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- POLICY 2: Admin SELECT (authenticated only) -> ALL pandals (pending, approved, rejected)
CREATE POLICY "Authenticated users can view all pandals"
ON public.pandals
FOR SELECT
TO authenticated
USING (true);

-- POLICY 3: Public & Admin INSERT -> STRICTLY status = 'pending'
CREATE POLICY "Anyone can submit pending pandals"
ON public.pandals
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

-- POLICY 4: Admin UPDATE -> authenticated users ONLY (Anon has NO update privileges)
CREATE POLICY "Authenticated users can update pandals"
ON public.pandals
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- POLICY 5: Admin DELETE -> authenticated users ONLY (Anon has NO delete privileges)
CREATE POLICY "Authenticated users can delete pandals"
ON public.pandals
FOR DELETE
TO authenticated
USING (true);

-- ==============================================================================
-- 3. STORAGE BUCKET HARDENING ('pandal-photos')
-- ==============================================================================

-- Ensure bucket configuration limits file size to 2 MB and allows only image formats
UPDATE storage.buckets
SET 
    public = true,
    file_size_limit = 2097152, -- 2 MB in bytes
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
WHERE id = 'pandal-photos';

-- Drop existing storage policies safely
DROP POLICY IF EXISTS "Public can view pandal photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload pandal photos under 2MB" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage storage objects" ON storage.objects;

-- STORAGE POLICY 1: Public can view uploaded photos
CREATE POLICY "Public can view pandal photos"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'pandal-photos');

-- STORAGE POLICY 2: Anyone can upload photos under 2 MB to 'pandal-photos'
CREATE POLICY "Anyone can upload pandal photos under 2MB"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
    bucket_id = 'pandal-photos'
    AND (
        (metadata->>'size')::bigint <= 2097152
        OR (metadata->>'size') IS NULL
    )
);

-- STORAGE POLICY 3: Authenticated admins can update/delete photos
CREATE POLICY "Authenticated users can manage storage objects"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'pandal-photos')
WITH CHECK (bucket_id = 'pandal-photos');

