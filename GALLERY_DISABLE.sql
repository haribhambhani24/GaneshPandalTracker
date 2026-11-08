-- ==============================================================================
-- GANESH PANDAL TRACKER - DISABLE GALLERY POLICIES (OPTIONAL RUN)
-- ==============================================================================
-- NOTICE: DO NOT RUN AUTOMATICALLY. This script is provided for database
-- administrators who wish to strictly disable multi-photo gallery uploads and
-- modifications at the database RLS level while keeping all cover photos and
-- pandal submission uploads active.
--
-- WHAT THIS SCRIPT DOES:
-- 1. Keeps existing cover photos active and publicly readable for all approved pandals.
-- 2. Keeps public submission uploads to the 'submissions/' folder active for the Submit Form.
-- 3. Disables inserting new gallery rows into public.pandal_photos.
-- 4. Retains admin update ability on public.pandals.photo_url for cover photo management.
-- ==============================================================================

-- 1. Verify pandal_photos table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'pandal_photos'
    ) THEN
        -- Drop insert policy for gallery photos so no new gallery items can be inserted
        DROP POLICY IF EXISTS "Admins can insert photos" ON public.pandal_photos;

        -- Ensure public read remains active for all approved pandals
        -- (Ensures cover photos seeded into pandal_photos remain viewable)
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
    END IF;
END $$;

-- 2. Restrict storage uploads in 'pandal-photos' bucket:
-- Ensure public visitor submissions can still upload single cover photos to 'submissions/'
DO $$
BEGIN
    -- Ensure submissions folder upload policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Allow visitor submit form uploads to submissions folder'
    ) THEN
        CREATE POLICY "Allow visitor submit form uploads to submissions folder"
        ON storage.objects
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (
            bucket_id = 'pandal-photos'
            AND (storage.foldername(name))[1] = 'submissions'
        );
    END IF;

    -- Drop admin gallery storage upload policy if restricting storage level uploads
    DROP POLICY IF EXISTS "Admins can upload pandal gallery photos" ON storage.objects;
END $$;

-- ==============================================================================
-- SUMMARY:
-- - Cover photos on cards, detail page, and map popups: ACTIVE.
-- - Public submit pandal photo upload: ACTIVE.
-- - Multi-photo gallery uploads and table inserts: RESTRICTED.
-- ==============================================================================

