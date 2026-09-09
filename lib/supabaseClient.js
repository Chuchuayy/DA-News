import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://femroomripuxyscdenwj.supabase.co';
const supabaseAnonKey = 'sb_publishable_k59gKAKcmMCm3_ZRWV0TTA_qPzAL0c6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
