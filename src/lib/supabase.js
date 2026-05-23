import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(raw) {
  if (!raw) return '';
  let url = raw.trim().replace(/\/+$/, '');
  // Common mistake: pasting the REST base instead of the project URL
  url = url.replace(/\/rest\/v1$/i, '');
  return url;
}

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  url && key && !url.includes('your-project') && url.includes('supabase.co')
);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
