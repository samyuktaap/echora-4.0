-- COMPLETE FIX FOR NGO APPROVAL & TYPO ISSUES
-- RUN THIS ENTIRE FILE IN SUPABASE SQL EDITOR

-- 1. FIX NGO APPROVAL FUNCTIONALITY
-- Drop existing policies
DROP POLICY IF EXISTS "NGOs can view applications" ON public.ngo_applications;
DROP POLICY IF EXISTS "NGOs can update application status" ON public.ngo_applications;
DROP POLICY IF EXISTS "Volunteers can manage own applications" ON public.ngo_applications;

-- Create comprehensive policies for NGOs
CREATE POLICY "NGOs can view applications"
  ON public.ngo_applications FOR SELECT
  USING (auth.uid() = ngo_id);

CREATE POLICY "NGOs can update applications"
  ON public.ngo_applications FOR UPDATE
  USING (auth.uid() = ngo_id);

-- Create policy for volunteers
CREATE POLICY "Volunteers can manage own applications"
  ON public.ngo_applications FOR ALL
  USING (auth.uid() = volunteer_id);

-- 2. FIX TYPO IN TASK DATA
UPDATE public.ngo_tasks 
SET title = 'English Teaching' 
WHERE title = 'english teachoing';

UPDATE public.ngo_tasks 
SET title = REPLACE(title, 'teachoing', 'teaching')
WHERE title LIKE '%teachoing%';

-- 3. VERIFY RLS IS ENABLED
ALTER TABLE public.ngo_applications ENABLE ROW LEVEL SECURITY;

-- 4. SHOW RESULTS
SELECT 'NGO Approval Policies Created Successfully' as status;
SELECT 'Typo Fixed Successfully' as status;
