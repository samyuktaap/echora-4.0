-- Fix for NGO approval functionality
-- Run this in your Supabase SQL Editor

-- NGOs can update application status for their tasks
create policy "NGOs can update application status"
  on public.ngo_applications for update
  using (auth.uid() = ngo_id);
