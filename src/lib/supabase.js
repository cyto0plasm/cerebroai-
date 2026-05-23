import { createClient } from '@supabase/supabase-js';

function normalizeSupabaseUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim().replace(/\/+$/, '');
  url = url.replace(/\/rest\/v1$/i, '');
  if (!url.startsWith('http')) url = `https://${url}`;
  return url;
}

export function getSupabaseEnv() {
  const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return { url, key };
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) return false;
  if (url.includes('your-project')) return false;
  if (!key.startsWith('eyJ')) return false;
  return url.includes('supabase.co');
}

export function getSupabaseConfigStatus() {
  const { url, key } = getSupabaseEnv();
  if (!url && !key) {
    return 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.';
  }
  if (!url) return 'Missing VITE_SUPABASE_URL in .env.local';
  if (!key) return 'Missing VITE_SUPABASE_ANON_KEY in .env.local';
  if (!isSupabaseConfigured()) {
    return 'Invalid Supabase settings. URL must be https://YOUR_REF.supabase.co (no /rest/v1). Key must be the anon public key.';
  }
  return null;
}

let client = null;
let clientKey = '';

export function getSupabase() {
  const { url, key } = getSupabaseEnv();
  if (!isSupabaseConfigured()) {
    client = null;
    clientKey = '';
    return null;
  }
  const fingerprint = `${url}|${key.slice(0, 16)}`;
  if (!client || clientKey !== fingerprint) {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    clientKey = fingerprint;
  }
  return client;
}
