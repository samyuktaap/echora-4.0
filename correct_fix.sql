-- CORRECT SQL for NGO approval functionality fix
-- Run ONLY this query in your Supabase SQL Editor

-- NGOs can update application status for their tasks
create policy "NGOs can update application status"
  on public.ngo_applications for update
  using (auth.uid() = ngo_id);
