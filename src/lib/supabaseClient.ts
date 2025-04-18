
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Default to empty strings if environment variables are not defined
// This prevents the "supabaseUrl is required" error during development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log for debugging purposes
console.log('Supabase URL:', supabaseUrl ? 'URL provided' : 'URL missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Key provided' : 'Key missing');

// Create client with safeguards
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
