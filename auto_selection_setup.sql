-- AUTO-SELECTION FEATURE SETUP
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Add auto-selection preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS auto_selection_enabled boolean DEFAULT false;

-- 2. Add auto-selection threshold (minimum compatibility score)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS auto_selection_threshold integer DEFAULT 70;

-- 3. Add function to calculate compatibility score (similar to TaskBoard logic)
CREATE OR REPLACE FUNCTION calculate_volunteer_compatibility(
  volunteer_profile jsonb,
  task_data jsonb
) RETURNS integer AS $$
DECLARE
  score integer := 0;
  skills_match integer := 0;
  location_match boolean := false;
  experience_match boolean := false;
BEGIN
  -- Skills overlap (50 points)
  IF task_data ? 'required_skills' AND jsonb_array_length(task_data->'required_skills') > 0 THEN
    SELECT COUNT(*) INTO skills_match
    FROM jsonb_array_elements_text(task_data->'required_skills') skill
    WHERE skill = ANY(SELECT jsonb_array_elements_text(volunteer_profile->'skills'));
    
    score := score + ROUND((skills_match::float / jsonb_array_length(task_data->'required_skills')::float) * 50);
  ELSE
    score := score + 25; -- No skills required
  END IF;

  -- Location match (30 points)
  IF volunteer_profile ? 'location' AND task_data ? 'location' THEN
    location_match := (
      LOWER(volunteer_profile->>'location') = LOWER(task_data->>'location') OR
      volunteer_profile->>'location' LIKE '%' || task_data->>'location' || '%' OR
      task_data->>'location' LIKE '%' || volunteer_profile->>'location' || '%'
    );
    
    IF location_match THEN
      score := score + 30;
    END IF;
  END IF;

  -- Experience match (20 points)
  IF volunteer_profile ? 'experience' AND task_data ? 'min_experience' THEN
    experience_match := (
      (CASE volunteer_profile->>'experience'
        WHEN 'Beginner' THEN 0
        WHEN 'Intermediate' THEN 1
        WHEN 'Expert' THEN 2
        ELSE 0
      END) >=
      (CASE task_data->>'min_experience'
        WHEN 'Beginner' THEN 0
        WHEN 'Intermediate' THEN 1
        WHEN 'Expert' THEN 2
        ELSE 0
      END)
    );
    
    IF experience_match THEN
      score := score + 10;
    END IF;
    
    -- Points bonus (up to 10)
    score := score + LEAST((COALESCE((volunteer_profile->>'points')::integer, 0) / 50), 10);
  END IF;

  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function for auto-selection of applications
CREATE OR REPLACE FUNCTION auto_select_applications(task_id_param bigint, ngo_id_param uuid)
RETURNS void AS $$
DECLARE
  app_record record;
  compatibility_score integer;
  threshold integer;
BEGIN
  -- Get NGO's auto-selection threshold
  SELECT COALESCE(auto_selection_threshold, 70) INTO threshold
  FROM public.profiles
  WHERE id = ngo_id_param;

  -- Process each pending application for this task
  FOR app_record IN 
    SELECT * FROM public.ngo_applications 
    WHERE task_id = task_id_param::text 
    AND status = 'pending'
    AND ngo_id = ngo_id_param
  LOOP
    -- Calculate compatibility score
    SELECT calculate_volunteer_compatibility(
      jsonb_build_object(
        'skills', COALESCE((SELECT skills FROM public.profiles WHERE id = app_record.volunteer_id), '{}'::text[]),
        'location', COALESCE((SELECT location FROM public.profiles WHERE id = app_record.volunteer_id), ''),
        'experience', COALESCE((SELECT experience FROM public.profiles WHERE id = app_record.volunteer_id), 'Beginner'),
        'points', COALESCE((SELECT points FROM public.profiles WHERE id = app_record.volunteer_id), 0)
      ),
      jsonb_build_object(
        'required_skills', COALESCE((SELECT required_skills FROM public.ngo_tasks WHERE id = task_id_param), '{}'::text[]),
        'location', COALESCE((SELECT location FROM public.ngo_tasks WHERE id = task_id_param), ''),
        'min_experience', COALESCE((SELECT min_experience FROM public.ngo_tasks WHERE id = task_id_param), 'Beginner')
      )
    ) INTO compatibility_score;

    -- Auto-approve or reject based on threshold
    IF compatibility_score >= threshold THEN
      UPDATE public.ngo_applications 
      SET status = 'approved' 
      WHERE id = app_record.id;
      
      -- Send notification to volunteer
      INSERT INTO public.notifications (user_id, type, title, message, related_id)
      VALUES (
        app_record.volunteer_id,
        'application_approved',
        'Application Approved by NGO! 🎉',
        'Congratulations! Your application has been automatically approved based on your high compatibility score. The NGO has selected you for this opportunity.',
        app_record.id
      );
    ELSE
      UPDATE public.ngo_applications 
      SET status = 'rejected' 
      WHERE id = app_record.id;
      
      -- Send notification to volunteer
      INSERT INTO public.notifications (user_id, type, title, message, related_id)
      VALUES (
        app_record.volunteer_id,
        'application_rejected',
        'Application Not Selected',
        'Your application was not selected as it did not meet the compatibility threshold. Keep applying to other opportunities!',
        app_record.id
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Show success
SELECT 'Auto-selection system created successfully' as result;
