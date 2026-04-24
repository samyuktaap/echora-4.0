# How to Run the Auto-Selection Function

## Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query" to open a new SQL editor tab

## Step 2: Copy and Run the SQL
1. Copy the entire contents of `auto_selection_working.sql`
2. Paste it into the SQL editor
3. Click "Run" or press Ctrl+Enter

## Step 3: Verify Success
You should see this message:
```
Auto-selection function created successfully - No errors!
```

## Step 4: Test the Function
To test the auto-selection function, run:
```sql
SELECT auto_select_applications(1, 'your-ngo-uuid');
```

Replace `1` with your task ID and `your-ngo-uuid` with the actual NGO UUID.

## What This Function Does:
- Processes pending volunteer applications
- Calculates compatibility scores (0-100%)
- Auto-approves applications above threshold (default 70%)
- Auto-rejects applications below threshold
- Sends notifications to volunteers with scores
- Works with skills, location, experience, and points

## Notes:
- The function is error-free and tested
- Uses proper SQL syntax for Supabase
- Includes comprehensive error handling
- Sends detailed notifications to volunteers
