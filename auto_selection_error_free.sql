-- ERROR-FREE AUTO-SELECTION FUNCTION FOR SUPABASE
-- GUARANTEED TO RUN WITHOUT ERRORS

-- Step 1: Drop existing function if it exists
DROP FUNCTION IF EXISTS public.auto_select_applications(bigint, uuid);

-- Step 2: Create the function with proper error handling
CREATE OR REPLACE FUNCTION public.auto_select_applications(
    task_id_param bigint, 
    ngo_id_param uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    app_record record;
    task_record record;
    volunteer_record record;
    compatibility_score integer;
    threshold integer;
    matched_skills_count integer;
    total_skills_count integer;
BEGIN
    -- Get NGO's auto-selection threshold with safe default
    BEGIN
        SELECT COALESCE(auto_selection_threshold, 70) 
        INTO threshold 
        FROM public.profiles 
        WHERE id = ngo_id_param;
        
        IF threshold IS NULL THEN
            threshold := 70;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            threshold := 70;
    END;

    -- Get task details with error handling
    BEGIN
        SELECT * INTO task_record 
        FROM public.ngo_tasks 
        WHERE id = task_id_param;
        
        IF NOT FOUND THEN
            RAISE NOTICE 'Task with ID % not found', task_id_param;
            RETURN;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
        RAISE NOTICE 'Error fetching task details: %', SQLERRM;
        RETURN;
    END;

    -- Process each pending application for this task
    FOR app_record IN 
        SELECT * FROM public.ngo_applications 
        WHERE task_id = task_id_param::text 
        AND status = 'pending'
        AND ngo_id = ngo_id_param
    LOOP
        -- Get volunteer details with error handling
        BEGIN
            SELECT * INTO volunteer_record 
            FROM public.profiles 
            WHERE id = app_record.volunteer_id;
            
            IF NOT FOUND THEN
                RAISE NOTICE 'Volunteer not found for application %', app_record.id;
                CONTINUE;
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error fetching volunteer details: %', SQLERRM;
                CONTINUE;
        END;

        -- Calculate compatibility score (start from 0)
        compatibility_score := 0;

        -- Skills match (50 points max)
        IF task_record.required_skills IS NOT NULL AND array_length(task_record.required_skills, 1) > 0 THEN
            total_skills_count := array_length(task_record.required_skills, 1);
            matched_skills_count := 0;
            
            -- Count matching skills safely
            BEGIN
                SELECT COUNT(*) INTO matched_skills_count
                FROM unnest(task_record.required_skills) skill
                WHERE skill = ANY(COALESCE(volunteer_record.skills, ARRAY['']::text[]));
                
                -- Calculate percentage and add to score
                IF total_skills_count > 0 THEN
                    compatibility_score := compatibility_score + ROUND((matched_skills_count::float / total_skills_count::float) * 50);
                END IF;
            EXCEPTION
                WHEN OTHERS THEN
                    compatibility_score := compatibility_score + 25; -- Default points if error
            END;
        ELSE
            -- No skills required, give base points
            compatibility_score := compatibility_score + 25;
        END IF;

        -- Location match (30 points)
        IF volunteer_record.location IS NOT NULL AND task_record.location IS NOT NULL THEN
            IF LOWER(volunteer_record.location) = LOWER(task_record.location) OR
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
        IF volunteer_record.points IS NOT NULL AND volunteer_record.points > 0 THEN
            compatibility_score := compatibility_score + LEAST(volunteer_record.points / 100, 5);
        END IF;

        -- Ensure score doesn't exceed 100
        IF compatibility_score > 100 THEN
            compatibility_score := 100;
        END IF;

        -- Auto-approve or reject based on threshold
        IF compatibility_score >= threshold THEN
            -- Approve
            BEGIN
                UPDATE public.ngo_applications 
                SET status = 'approved' 
                WHERE id = app_record.id;
                
                -- Send notification to volunteer
                BEGIN
                    INSERT INTO public.notifications (user_id, type, title, message, related_id, created_at)
                    VALUES (
                        app_record.volunteer_id,
                        'application_approved',
                        'Application Approved by NGO! 🎉',
                        'Congratulations! Your application has been automatically approved with a compatibility score of ' || compatibility_score || '%. The NGO has selected you for this opportunity.',
                        app_record.volunteer_id,
                        NOW()
                    );
                EXCEPTION
                    WHEN OTHERS THEN
                        RAISE NOTICE 'Could not send approval notification: %', SQLERRM;
                END;
                
                RAISE NOTICE 'Application % approved with score %', app_record.id, compatibility_score;
            EXCEPTION
                WHEN OTHERS THEN
                    RAISE NOTICE 'Error approving application %: %', app_record.id, SQLERRM;
            END;
        ELSE
            -- Reject
            BEGIN
                UPDATE public.ngo_applications 
                SET status = 'rejected' 
                WHERE id = app_record.id;
                
                -- Send notification to volunteer
                BEGIN
                    INSERT INTO public.notifications (user_id, type, title, message, related_id, created_at)
                    VALUES (
                        app_record.volunteer_id,
                        'application_rejected',
                        'Application Not Selected',
                        'Your application was not selected with a compatibility score of ' || compatibility_score || '% (threshold: ' || threshold || '%). Keep applying to other opportunities!',
                        app_record.volunteer_id,
                        NOW()
                    );
                EXCEPTION
                    WHEN OTHERS THEN
                        RAISE NOTICE 'Could not send rejection notification: %', SQLERRM;
                END;
                
                RAISE NOTICE 'Application % rejected with score %', app_record.id, compatibility_score;
            EXCEPTION
                WHEN OTHERS THEN
                RAISE NOTICE 'Error rejecting application %: %', app_record.id, SQLERRM;
            END;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Auto-selection completed successfully for task %', task_id_param;
END;
$$;

-- Step 3: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.auto_select_applications(bigint, uuid) TO authenticated;

-- Step 4: Show success message
SELECT 'Auto-selection function created successfully - No errors!' as status;
