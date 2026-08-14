import { createClient } from "@supabase/supabase-js";

// These come from Project Settings > API in your Supabase dashboard,
// set as environment variables in Netlify (see README). The "anon"
// key is safe to expose in the browser — it only allows what the
// row-level security policies in supabase/setup.sql permit.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
