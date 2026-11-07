-- =========================================================================
-- GANESH PANDAL TRACKER: USER REPORTS & CORRECTIONS TABLE SETUP
-- =========================================================================
-- Creates the pandal_reports table for crowdsourced issue reporting:
-- - Anyone can insert a report (public contribution)
-- - Only authenticated admins can read, update, or resolve reports
-- Strictly uses CREATE TABLE IF NOT EXISTS, ALTER TABLE, and CREATE POLICY.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.pandal_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pandal_id TEXT NOT NULL,
  pandal_name TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT,
  reporter_name TEXT,
  reporter_contact TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pandal_reports ENABLE ROW LEVEL SECURITY;

-- 1. Public can insert reports (anyone can submit a correction)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pandal_reports' AND policyname = 'Public can submit reports'
  ) THEN
    CREATE POLICY "Public can submit reports"
      ON public.pandal_reports
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- 2. Authenticated Admin can view all reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pandal_reports' AND policyname = 'Admins can view reports'
  ) THEN
    CREATE POLICY "Admins can view reports"
      ON public.pandal_reports
      FOR SELECT
      TO authenticated
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 3. Authenticated Admin can update report status (e.g. mark resolved)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pandal_reports' AND policyname = 'Admins can update reports'
  ) THEN
    CREATE POLICY "Admins can update reports"
      ON public.pandal_reports
      FOR UPDATE
      TO authenticated
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 4. Authenticated Admin can delete reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'pandal_reports' AND policyname = 'Admins can delete reports'
  ) THEN
    CREATE POLICY "Admins can delete reports"
      ON public.pandal_reports
      FOR DELETE
      TO authenticated
      USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Helpful index for admin querying by status
CREATE INDEX IF NOT EXISTS idx_pandal_reports_status ON public.pandal_reports (status);
CREATE INDEX IF NOT EXISTS idx_pandal_reports_pandal_id ON public.pandal_reports (pandal_id);

