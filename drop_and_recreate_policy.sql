-- Drop existing policy and recreate it
-- Run this in your Supabase SQL Editor

-- Drop the existing policy first
drop policy if exists "NGOs can update application status" on public.ngo_applications;

-- Recreate the policy
create policy "NGOs can update application status"
  on public.ngo_applications for update
  using (auth.uid() = ngo_id);
