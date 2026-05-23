import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function fetchUserScans(userId) {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
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
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from('scans').upsert({
    id: scan.id,
    user_id: userId,
    display_name: scan.displayName || scan.fileName,
    payload: scan,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function updateScanName(userId, scanId, displayName) {
  if (!isSupabaseConfigured || !supabase) return;

  const { data: existing, error: fetchErr } = await supabase
    .from('scans')
    .select('payload')
    .eq('id', scanId)
    .eq('user_id', userId)
    .single();

  if (fetchErr) throw fetchErr;

  const payload = { ...existing.payload, displayName, fileName: displayName };

  const { error } = await supabase
    .from('scans')
    .update({ display_name: displayName, payload, updated_at: new Date().toISOString() })
    .eq('id', scanId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteScan(userId, scanId) {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from('scans').delete().eq('id', scanId).eq('user_id', userId);
  if (error) throw error;
}

export async function clearUserScans(userId) {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from('scans').delete().eq('user_id', userId);
  if (error) throw error;
}
