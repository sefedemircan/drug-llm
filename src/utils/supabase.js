import { createClient } from '@supabase/supabase-js';

// Supabase URL ve API anahtarı buraya eklenmelidir
// Bu değerler .env dosyasından alınmalıdır
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 