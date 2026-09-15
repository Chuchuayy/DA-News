import { createClient } from '@supabase/supabase-js';

// Prefer environment variables when provided, otherwise fall back to the
// project's published Supabase credentials so the client always works.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://femroomripuxyscdenwj.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_k59gKAKcmMCm3_ZRWV0TTA_qPzAL0c6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
