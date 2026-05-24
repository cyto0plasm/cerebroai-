import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { toCloudPayload, sanitizeDisplayName } from '../utils/scanCloud';

export async function fetchUserScans(userId) {
  const sb = getSupabase();
  if (!isSupabaseConfigured() || !sb) return [];

  const { data, error } = await sb
    .from('scans')
    .select('id, display_name, payload, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    ...row.payload,
    id: row.id,
    displayName: row.display_name,
    fileName: row.display_name,
    timestamp: row.payload?.timestamp || row.created_at,
  }));
}

export async function upsertScan(userId, scan) {
  const sb = getSupabase();
  if (!sb) return;

  const cloudScan = toCloudPayload(scan);
  const { error } = await sb.from('scans').upsert({
    id: scan.id,
    user_id: userId,
    display_name: sanitizeDisplayName(scan.displayName || scan.fileName),
    payload: cloudScan,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function updateScanName(userId, scanId, displayName) {
  const sb = getSupabase();
  if (!sb) return;

  const { data: existing, error: fetchErr } = await sb
    .from('scans')
    .select('payload')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single();

  if (fetchErr) throw fetchErr;

  const safeName = sanitizeDisplayName(displayName);
  const payload = { ...existing.payload, displayName: safeName, fileName: safeName };

  const { error } = await sb
    .from('scans')
    .update({ display_name: safeName, payload, updated_at: new Date().toISOString() })
    .eq('id', scanId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteScan(userId, scanId) {
  const sb = getSupabase();
  if (!sb) return;

  const { error } = await sb.from('scans').delete().eq('id', scanId).eq('user_id', userId);
  if (error) throw error;
}

export async function clearUserScans(userId) {
  const sb = getSupabase();
  if (!sb) return;

  const { error } = await sb.from('scans').delete().eq('user_id', userId);
  if (error) throw error;
}
