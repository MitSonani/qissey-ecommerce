import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key if available, otherwise fallback to anon key
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase credentials missing in server environment.');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
