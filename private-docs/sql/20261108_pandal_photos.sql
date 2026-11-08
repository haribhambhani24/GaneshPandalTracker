-- ==============================================================================
-- GANESH PANDAL TRACKER - PHOTO & GALLERY MANAGER MIGRATION
-- ==============================================================================
-- Idempotent migration script: Uses CREATE TABLE IF NOT EXISTS, ALTER, and CREATE OR REPLACE only.
-- Strict safety: Contains NO DROP TABLE, NO DELETE, and NO TRUNCATE statements.
-- ==============================================================================

-- 1. Create admin_users table if not existing for secure RBAC verification
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper security function to verify whether current requester is a verified admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE email = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    OR (coalesce(auth.jwt() ->> 'role', '') = 'admin')
    OR (coalesce((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');
$$;

-- 2. Create pandal_photos table
CREATE TABLE IF NOT EXISTS public.pandal_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id TEXT NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    thumb_path TEXT NOT NULL,
    caption_en TEXT DEFAULT '',
    caption_hi TEXT DEFAULT '',
    caption_mr TEXT DEFAULT '',
    alt_text TEXT DEFAULT '',
    credit TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Performance indexes for fast pandal photo joins and ordering
CREATE INDEX IF NOT EXISTS idx_pandal_photos_pandal_id ON public.pandal_photos(pandal_id);
CREATE INDEX IF NOT EXISTS idx_pandal_photos_sort ON public.pandal_photos(pandal_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_pandal_photos_cover ON public.pandal_photos(pandal_id) WHERE is_cover = true;

-- 3. Migrate existing single photo URLs from pandals table into pandal_photos
-- Ensures zero data loss and seeds the cover photo for all existing pandals
INSERT INTO public.pandal_photos (
    pandal_id,
    storage_path,
    thumb_path,
    caption_en,
    caption_hi,
    caption_mr,
    alt_text,
    credit,
    sort_order,
    is_cover
)
SELECT
    p.id AS pandal_id,
    p.photo_url AS storage_path,
    p.photo_url AS thumb_path,
    p.name AS caption_en,
    COALESCE(p.name, '') AS caption_hi,
    COALESCE(p.name, '') AS caption_mr,
    p.name || ' Ganesh Idol' AS alt_text,
    'Official Mandal' AS credit,
    0 AS sort_order,
    true AS is_cover
FROM public.pandals p
WHERE p.photo_url IS NOT NULL
  AND trim(p.photo_url) <> ''
  AND NOT EXISTS (
      SELECT 1 FROM public.pandal_photos ph WHERE ph.pandal_id = p.id
  );

-- 4. Row Level Security (RLS) on pandal_photos
ALTER TABLE public.pandal_photos ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public (anon & authenticated) can ONLY read photos belonging to approved pandals
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'pandal_photos'
        AND policyname = 'Public can view photos of approved pandals'
    ) THEN
        CREATE POLICY "Public can view photos of approved pandals"
        ON public.pandal_photos
        FOR SELECT
        TO anon, authenticated
        USING (
            EXISTS (
                SELECT 1 FROM public.pandals
                WHERE public.pandals.id = public.pandal_photos.pandal_id
                AND public.pandals.status = 'approved'
            )
            OR public.is_admin()
        );
    END IF;
END $$;

-- Policy 2: ONLY verified admins can INSERT new photos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'pandal_photos'
        AND policyname = 'Admins can insert photos'
    ) THEN
        CREATE POLICY "Admins can insert photos"
        ON public.pandal_photos
        FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Policy 3: ONLY verified admins can UPDATE photos (reorder, change cover, edit captions)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'pandal_photos'
        AND policyname = 'Admins can update photos'
    ) THEN
        CREATE POLICY "Admins can update photos"
        ON public.pandal_photos
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;

-- Policy 4: ONLY verified admins can DELETE photos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'pandal_photos'
        AND policyname = 'Admins can delete photos'
    ) THEN
        CREATE POLICY "Admins can delete photos"
        ON public.pandal_photos
        FOR DELETE
        TO authenticated
        USING (public.is_admin());
    END IF;
END $$;

-- 5. Storage Bucket Configuration & Storage Policies for "pandal-photos"
-- Update bucket limits to 5MB (5242880 bytes) and allowed MIME types (JPEG, PNG, WebP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'pandal-photos',
    'pandal-photos',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage Policy 1: Public read access for all objects in pandal-photos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Public can view pandal photos'
    ) THEN
        CREATE POLICY "Public can view pandal photos"
        ON storage.objects
        FOR SELECT
        TO anon, authenticated
        USING (bucket_id = 'pandal-photos');
    END IF;
END $$;

-- Storage Policy 2: Allow visitor submit form uploads strictly to 'submissions/' folder under 5MB
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Visitors can upload pending submission photos under 5MB'
    ) THEN
        CREATE POLICY "Visitors can upload pending submission photos under 5MB"
        ON storage.objects
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (
            bucket_id = 'pandal-photos'
            AND (name LIKE 'submissions/%')
            AND (
                (metadata->>'size')::bigint <= 5242880
                OR (metadata->>'size') IS NULL
            )
        );
    END IF;
END $$;

-- Storage Policy 3: ONLY admins can upload to 'pandals/' gallery paths
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Admins can upload to pandals gallery storage'
    ) THEN
        CREATE POLICY "Admins can upload to pandals gallery storage"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'pandal-photos'
            AND public.is_admin()
            AND (
                (metadata->>'size')::bigint <= 5242880
                OR (metadata->>'size') IS NULL
            )
        );
    END IF;
END $$;

-- Storage Policy 4: ONLY admins can update or delete storage objects
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Admins can update and delete pandal storage'
    ) THEN
        CREATE POLICY "Admins can update and delete pandal storage"
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (bucket_id = 'pandal-photos' AND public.is_admin())
        WITH CHECK (bucket_id = 'pandal-photos' AND public.is_admin());

        CREATE POLICY "Admins can delete pandal storage"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (bucket_id = 'pandal-photos' AND public.is_admin());
    END IF;
END $$;

