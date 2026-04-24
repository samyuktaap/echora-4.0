-- Fix corrupted task data
-- Run this in your Supabase SQL Editor

-- Fix the typo in task title
UPDATE public.ngo_tasks 
SET title = 'English Teaching' 
WHERE title = 'english teachoing';

-- Fix corrupted descriptions (you may need to adjust based on actual data)
UPDATE public.ngo_tasks 
SET description = 'Help teach English to underprivileged children and adults. Make a difference through education.' 
WHERE description LIKE '%ndhdiuc jedichw%';

-- Check for other common typos
UPDATE public.ngo_tasks 
SET title = REPLACE(title, 'teachoing', 'teaching')
WHERE title LIKE '%teachoing%';
