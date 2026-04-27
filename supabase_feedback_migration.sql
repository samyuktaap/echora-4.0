-- ============================================================
-- ECHORA: NGO Feedback Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add feedback_seen column to ngo_applications
--    Defaults to FALSE so all existing feedback shows as "new"
ALTER TABLE ngo_applications
  ADD COLUMN IF NOT EXISTS feedback_seen BOOLEAN DEFAULT FALSE;

-- 2. Create an index for fast sidebar badge queries
CREATE INDEX IF NOT EXISTS idx_ngo_applications_feedback_seen
  ON ngo_applications (volunteer_id, feedback_seen)
  WHERE ngo_feedback IS NOT NULL;

-- 3. (Optional) Mark all pre-existing feedback as already seen
--    Uncomment this line if you DON'T want old feedback to show as "new":
-- UPDATE ngo_applications SET feedback_seen = TRUE WHERE ngo_feedback IS NOT NULL;

-- ============================================================
-- VERIFICATION: Check the column was added
-- ============================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'ngo_applications'
  AND column_name = 'feedback_seen';
