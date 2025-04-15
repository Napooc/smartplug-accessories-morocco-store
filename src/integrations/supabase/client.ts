
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
    },
    // Adding global error handlers to prevent silent failures
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        console.log(`Supabase request to: ${typeof input === 'string' ? input : input.toString()}`);
        return fetch(input, init).then(response => {
          if (!response.ok) {
            console.error(`Supabase request failed: ${response.status} ${response.statusText}`);
          }
          return response;
        }).catch(error => {
          console.error('Supabase request error:', error);
          throw error;
        });
      }
    }
  }
);
