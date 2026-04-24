-- FINAL AUTO-SELECTION FUNCTION - GUARANTEED TO WORK
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Completely drop and recreate the function
DROP FUNCTION IF EXISTS auto_select_applications CASCADE;

-- 2. Create the function with a different name to avoid conflicts
CREATE OR REPLACE FUNCTION process_auto_selection(task_id_param bigint, ngo_id_param uuid)
RETURNS void AS $$
DECLARE
  app_record record;
  task_record record;
  volunteer_record record;
  compatibility_score integer;
  threshold integer;
  notification_message text;
BEGIN
  -- Get NGO's auto-selection threshold
  SELECT COALESCE(auto_selection_threshold, 70) INTO threshold
  FROM public.profiles
  WHERE id = ngo_id_param;

  -- Get task details
  SELECT * INTO task_record
  FROM public.ngo_tasks 
  WHERE id = task_id_param;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found: %', task_id_param;
  END IF;

  -- Process each pending application for this task
  FOR app_record IN 
    SELECT * FROM public.ngo_applications 
    WHERE task_id = task_id_param::text 
    AND status = 'pending'
    AND ngo_id = ngo_id_param
  LOOP
    -- Get volunteer details
    SELECT * INTO volunteer_record
    FROM public.profiles
    WHERE id = app_record.volunteer_id;

    IF NOT FOUND THEN
      CONTINUE;
    END IF;

    -- Reset compatibility score
    compatibility_score := 0;

    -- Skills match calculation (50 points max)
    IF task_record.required_skills IS NOT NULL AND array_length(task_record.required_skills, 1) > 0 THEN
      DECLARE
        total_skills integer := array_length(task_record.required_skills, 1);
        matched_skills integer := 0;
        skill_text text;
      BEGIN
        -- Count matching skills
        FOR skill_text IN SELECT unnest(task_record.required_skills) LOOP
          IF skill_text = ANY(COALESCE(volunteer_record.skills, ARRAY['']::text[])) THEN
            matched_skills := matched_skills + 1;
          END IF;
        END LOOP;
        
        -- Calculate percentage and add to score
        compatibility_score := compatibility_score + ROUND((matched_skills::float / total_skills::float) * 50);
      END;
    ELSE
      -- No skills required, give base points
      compatibility_score := compatibility_score + 25;
    END IF;

    -- Location match (30 points)
    IF volunteer_record.location IS NOT NULL AND task_record.location IS NOT NULL THEN
      IF LOWER(TRIM(volunteer_record.location)) = LOWER(TRIM(task_record.location)) OR
         volunteer_record.location LIKE '%' || task_record.location || '%' OR
         task_record.location LIKE '%' || volunteer_record.location || '%' THEN
        compatibility_score := compatibility_score + 30;
      END IF;
    END IF;

    -- Experience match (15 points)
    IF volunteer_record.experience IS NOT NULL AND task_record.min_experience IS NOT NULL THEN
      IF (volunteer_record.experience = 'Expert' AND task_record.min_experience IN ('Beginner', 'Intermediate', 'Expert')) OR
         (volunteer_record.experience = 'Intermediate' AND task_record.min_experience IN ('Beginner', 'Intermediate')) OR
         (volunteer_record.experience = 'Beginner' AND task_record.min_experience = 'Beginner') THEN
        compatibility_score := compatibility_score + 15;
      END IF;
    END IF;

    -- Points bonus (5 points max)
    IF volunteer_record.points IS NOT NULL THEN
      compatibility_score := compatibility_score + LEAST(volunteer_record.points / 100, 5);
    END IF;

    -- Debug output
    RAISE NOTICE 'Volunteer %: Score = %, Threshold = %', volunteer_record.name, compatibility_score, threshold;

    -- Auto-approve or reject based on threshold
    IF compatibility_score >= threshold THEN
      -- Approve
      UPDATE public.ngo_applications 
      SET status = 'approved' 
      WHERE id = app_record.id;
      
      -- Create notification message
      notification_message := 'Congratulations! Your application has been automatically approved with a compatibility score of ' || compatibility_score || '%. The NGO has selected you for this opportunity.';
      
      -- Send notification
      INSERT INTO public.notifications (user_id, type, title, message, related_id)
      VALUES (
        app_record.volunteer_id,
        'application_approved',
        'Application Approved by NGO! 🎉',
        notification_message,
        app_record.volunteer_id
      );
      
      RAISE NOTICE 'Approved volunteer % with score %', volunteer_record.name, compatibility_score;
    ELSE
      -- Reject
      UPDATE public.ngo_applications 
      SET status = 'rejected' 
      WHERE id = app_record.id;
      
      -- Create notification message
      notification_message := 'Your application was not selected with a compatibility score of ' || compatibility_score || '% (threshold: ' || threshold || '%). Keep applying to other opportunities!';
      
      -- Send notification
      INSERT INTO public.notifications (user_id, type, title, message, related_id)
      VALUES (
        app_record.volunteer_id,
        'application_rejected',
        'Application Not Selected',
        notification_message,
        app_record.volunteer_id
      );
      
      RAISE NOTICE 'Rejected volunteer % with score %', volunteer_record.name, compatibility_score;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a wrapper function with the original name
CREATE OR REPLACE FUNCTION auto_select_applications(task_id_param bigint, ngo_id_param uuid)
RETURNS void AS $$
BEGIN
  PERFORM process_auto_selection(task_id_param, ngo_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Show success
SELECT 'Auto-selection function created successfully' as result;
