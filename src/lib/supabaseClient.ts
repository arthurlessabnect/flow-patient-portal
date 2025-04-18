
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the hardcoded values from the automatically generated client
const supabaseUrl = "https://dhwmgjyrshdvlngaxgfu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRod21nanlyc2hkdmxuZ2F4Z2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzAyMDMsImV4cCI6MjA1ODUwNjIwM30.mggw5CtBxPW_M5uwcx3o2eS5z4Tb6GXOvHOcyxeRTfc";

// Create client with specific auth configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
