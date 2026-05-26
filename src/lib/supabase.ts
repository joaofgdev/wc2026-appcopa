import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy_key';

if (!supabaseUrl || !supabaseKey) {
  console.warn("Atenção: Credenciais do Supabase não encontradas no arquivo .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
