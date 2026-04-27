-- Fix for NGO feedback not showing NGO name
-- Run this in Supabase SQL Editor

-- 1. Add ngo_name column to ngo_applications if not exists
ALTER TABLE public.ngo_applications
ADD COLUMN IF NOT EXISTS ngo_name text;

-- 2. Update existing applications to populate ngo_name from profiles
UPDATE public.ngo_applications na
SET ngo_name = p.name
FROM public.profiles p
WHERE na.ngo_id = p.id AND na.ngo_name IS NULL;
