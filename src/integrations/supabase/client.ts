
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iqnubejihoxrymmskpis.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbnViZWppaG94cnltbXNrcGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDY0MDQsImV4cCI6MjA1OTIyMjQwNH0.kPRjOTpdmfHiiTsy9tuFidJeacS3CooqoMeoxHvPQBU";

// Configure the Supabase client with explicit auth options for better reliability
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
);
