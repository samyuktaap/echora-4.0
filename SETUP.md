# ECHORA — Database Setup Guide

## What changed
The auth system is now fully connected to **Supabase** (free, real database).
- ✅ Email + password login stored in real DB
- ✅ Each user's profile, notes, and data are **completely private** (Row Level Security)
- ✅ No one can see another user's data — enforced at database level
- ✅ Sessions persist across browser refreshes
- ❌ No credit card, no Firebase, no Google login needed

---

## Step 1 — Create a Supabase project (free)

1. Go to **https://supabase.com** → Sign Up (free tier is plenty)
2. Click **New Project** → fill in a name + password → Create
3. Wait ~1 minute for it to spin up

---

## Step 2 — Get your API keys

In your Supabase dashboard:
- Click **Settings** (gear icon, left sidebar) → **API**
- Copy **Project URL** → this is your `VITE_SUPABASE_URL`
- Copy **anon public** key → this is your `VITE_SUPABASE_ANON_KEY`

---

## Step 3 — Create your .env file

In the project root folder, create a file called `.env` (no extension):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Step 4 — Run the database SQL

1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Open the file `supabase_setup.sql` from this project
3. Copy everything → paste into SQL Editor → click **Run**

That's it! This creates:
- `profiles` table (one row per user, private)
- `notes` table (per user, private)
- Row Level Security policies (so users can ONLY see their own data)
- A trigger to auto-create a profile on signup

---

## Step 5 — Disable email confirmation (optional but recommended for dev)

In Supabase dashboard → **Authentication** → **Email** tab:
- Turn **OFF** "Enable email confirmations"

This lets users sign in immediately without checking their email.

---

## Step 6 — Start the app

```bash
npm install
npm run dev
```

---

## How data isolation works

Every database query is automatically filtered by the logged-in user's ID.
Supabase's Row Level Security (RLS) means:
- User A's profile: `SELECT * FROM profiles WHERE id = 'user-a-id'`
- User B trying to fetch User A's data → **database returns nothing**, not an error
- This is enforced at the PostgreSQL level, not just in app code

