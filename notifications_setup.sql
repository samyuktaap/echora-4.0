-- NOTIFICATIONS SYSTEM SETUP
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('application_approved', 'application_rejected', 'task_reminder', 'meetup_reminder')),
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid, -- Can be application_id, task_id, etc.
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Create policy for NGOs to create notifications (when they approve/reject)
CREATE POLICY "NGOs can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT ngo_id FROM public.ngo_applications 
      WHERE ngo_id = auth.uid()
    )
  );

-- 5. Create function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id bigint)
RETURNS void AS $$
BEGIN
  UPDATE public.notifications 
  SET is_read = true 
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Show success
SELECT 'Notifications system created successfully' as result;
