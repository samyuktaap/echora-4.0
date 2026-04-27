-- COMPLETE FIX FOR NGO FEEDBACK NOT SHOWING
-- Run this entire file in Supabase SQL Editor

-- 1. Add feedback columns if they don't exist
ALTER TABLE public.ngo_applications
ADD COLUMN IF NOT EXISTS ngo_feedback text,
ADD COLUMN IF NOT EXISTS ngo_rating integer CHECK (ngo_rating BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS ngo_name text;

-- 2. Update existing applications to populate ngo_name from profiles
UPDATE public.ngo_applications na
SET ngo_name = p.name
FROM public.profiles p
WHERE na.ngo_id = p.id AND na.ngo_name IS NULL;

-- 3. Ensure RLS is enabled
ALTER TABLE public.ngo_applications ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Volunteers can manage own applications" ON public.ngo_applications;
DROP POLICY IF EXISTS "NGOs can view applications" ON public.ngo_applications;
DROP POLICY IF EXISTS "NGOs can update application status" ON public.ngo_applications;

-- 5. Create proper policies
-- Volunteers can view their own applications (including feedback)
CREATE POLICY "Volunteers can view own applications"
  ON public.ngo_applications FOR SELECT
  USING (auth.uid() = volunteer_id);

-- Volunteers can insert their own applications
CREATE POLICY "Volunteers can insert own applications"
  ON public.ngo_applications FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

-- NGOs can view applications for their tasks
CREATE POLICY "NGOs can view applications"
  ON public.ngo_applications FOR SELECT
  USING (auth.uid() = ngo_id);

-- NGOs can update application status and feedback
CREATE POLICY "NGOs can update applications"
  ON public.ngo_applications FOR UPDATE
  USING (auth.uid() = ngo_id);

-- 6. Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ngo_applications' 
AND table_schema = 'public';
