-- FIX NGO APPLICATIONS STATUS CONSTRAINT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Drop the problematic constraint
ALTER TABLE public.ngo_applications DROP CONSTRAINT IF EXISTS ngo_applications_status_check;

-- 2. Add proper constraint with allowed values
ALTER TABLE public.ngo_applications 
ADD CONSTRAINT ngo_applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- 3. Show success message
SELECT 'Status constraint fixed successfully' as result;
