-- Complete fix for NGO approval functionality
-- Run this in your Supabase SQL Editor

-- 1. Drop existing policies to start fresh
DROP POLICY IF EXISTS "NGOs can view applications" ON public.ngo_applications;
DROP POLICY IF EXISTS "NGOs can update application status" ON public.ngo_applications;
DROP POLICY IF EXISTS "Volunteers can manage own applications" ON public.ngo_applications;

-- 2. Create comprehensive policies for NGOs
CREATE POLICY "NGOs can view applications"
  ON public.ngo_applications FOR SELECT
  USING (auth.uid() = ngo_id);

CREATE POLICY "NGOs can update applications"
  ON public.ngo_applications FOR UPDATE
  USING (auth.uid() = ngo_id);

-- 3. Create policy for volunteers
CREATE POLICY "Volunteers can manage own applications"
  ON public.ngo_applications FOR ALL
  USING (auth.uid() = volunteer_id);

-- 4. Verify RLS is enabled
ALTER TABLE public.ngo_applications ENABLE ROW LEVEL SECURITY;

-- 5. Test the setup
SELECT 
  schemaname,
  tablename,
  rowlevelsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'ngo_applications';
