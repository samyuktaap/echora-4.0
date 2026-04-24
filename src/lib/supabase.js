import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS
// ─────────────────────────────────────────────────────────────────────────────
// 1. Go to https://supabase.com and create a FREE project (no credit card needed)
// 2. In your Supabase dashboard → Settings → API:
//    Copy "Project URL"  → paste as VITE_SUPABASE_URL  in your .env file
//    Copy "anon public"  → paste as VITE_SUPABASE_ANON_KEY in your .env file
// 3. Run the SQL in supabase_setup.sql in your Supabase SQL editor
// 4. Restart your dev server
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn(
    '⚠️  ECHORA: Supabase URL not set.\n' +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
    'See src/lib/supabase.js for setup instructions.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,           // keeps user logged in across page refreshes
      autoRefreshToken: true,         // silently refreshes JWT tokens
      detectSessionInUrl: true,       // handles magic link / OAuth callbacks
    },
  }
);
