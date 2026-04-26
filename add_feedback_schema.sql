-- Run this in your Supabase SQL Editor to add the feedback columns

ALTER TABLE public.ngo_applications
ADD COLUMN IF NOT EXISTS ngo_feedback text,
ADD COLUMN IF NOT EXISTS ngo_rating integer CHECK (ngo_rating BETWEEN 1 AND 5);
