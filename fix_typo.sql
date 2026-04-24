-- Fix typo in task data
-- Run this in your Supabase SQL Editor

-- Fix "english teachoing" to "English Teaching"
UPDATE public.ngo_tasks 
SET title = 'English Teaching' 
WHERE title = 'english teachoing';

-- Also fix any other similar typos
UPDATE public.ngo_tasks 
SET title = REPLACE(title, 'teachoing', 'teaching')
WHERE title LIKE '%teachoing%';

-- Check if any typos remain
SELECT id, title FROM public.ngo_tasks WHERE title LIKE '%teachoing%';
