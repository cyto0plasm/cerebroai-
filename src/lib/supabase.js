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

function isValidSupabaseHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.endsWith('.supabase.co') || host.endsWith('.supabase.in');
  } catch {
    return false;
  }
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) return false;
  if (url.includes('your-project') || key.includes('your-anon')) return false;
  if (key.length < 20) return false;
  return isValidSupabaseHost(url);
}

export function getSupabaseConfigStatus() {
  const { url, key } = getSupabaseEnv();
  const isProd = import.meta.env.PROD;

  if (!url && !key) {
    return isProd
      ? 'Cloud sign-in is not set up on this site. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel → Environment Variables, then redeploy. You can still use Continue as guest.'
      : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.';
  }
  if (!url) return isProd ? 'Missing VITE_SUPABASE_URL in Vercel env.' : 'Missing VITE_SUPABASE_URL in .env.local';
  if (!key) return isProd ? 'Missing VITE_SUPABASE_ANON_KEY in Vercel env.' : 'Missing VITE_SUPABASE_ANON_KEY in .env.local';
  if (!isSupabaseConfigured()) {
    return 'Invalid Supabase settings. URL must be https://YOUR_REF.supabase.co (no /rest/v1). Use the anon public key from Project Settings → API.';
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
