-- ==============================================================================
-- GANESH PANDAL TRACKER - RE-ENABLE GALLERY POLICIES (OPTIONAL RUN)
-- ==============================================================================
-- NOTICE: DO NOT RUN AUTOMATICALLY. Run this script in the Supabase SQL Editor
-- when you are ready to restore full multi-photo gallery functionality in the database.
--
-- WHAT THIS SCRIPT DOES:
-- 1. Restores the "Admins can insert photos" policy on public.pandal_photos.
-- 2. Restores the "Admins can upload pandal gallery photos" policy in storage.objects.
-- 3. Verifies all RLS policies for SELECT, UPDATE, and DELETE are active.
-- ==============================================================================

-- 1. Re-enable Admin insert policy on public.pandal_photos
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'pandal_photos'
    ) THEN
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
    END IF;
END $$;

-- 2. Re-enable Admin storage upload policy on 'pandal-photos' bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects'
        AND schemaname = 'storage'
        AND policyname = 'Admins can upload pandal gallery photos'
    ) THEN
        CREATE POLICY "Admins can upload pandal gallery photos"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'pandal-photos'
            AND public.is_admin()
        );
    END IF;
END $$;

-- ==============================================================================
-- SUMMARY: Full gallery permissions restored.
-- ==============================================================================

