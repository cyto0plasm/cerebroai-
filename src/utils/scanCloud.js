const MAX_DISPLAY_NAME = 120;
const MAX_PATIENT_ID = 64;
const MAX_IMPORT_ITEMS = 100;

export function sanitizeDisplayName(name) {
  return String(name || '')
    .replace(/[\x00-\x1f\x7f]/g, '')
    .trim()
    .slice(0, MAX_DISPLAY_NAME);
}

export function sanitizePatientId(id) {
  if (!id) return null;
  const cleaned = String(id)
    .replace(/[\x00-\x1f\x7f]/g, '')
    .trim()
    .slice(0, MAX_PATIENT_ID);
  return cleaned || null;
}

/** Cloud DB: metadata only — avoids multi‑MB base64 rows and RLS abuse surface. */
export function toCloudPayload(scan) {
  const {
    previewUrl: _p,
    heatmap: _h,
    ...rest
  } = scan;
  return {
    ...rest,
    displayName: sanitizeDisplayName(scan.displayName || scan.fileName),
    fileName: sanitizeDisplayName(scan.displayName || scan.fileName),
    patientId: sanitizePatientId(scan.patientId),
    previewUrl: null,
    heatmap: null,
  };
}

export function validateImportHistory(history) {
  if (!Array.isArray(history)) {
    throw new Error('Invalid session file: expected a history array.');
  }
  if (history.length > MAX_IMPORT_ITEMS) {
    throw new Error(`Import limited to ${MAX_IMPORT_ITEMS} studies at once.`);
  }
  const valid = history.filter(
    (item) =>
      item &&
      typeof item.id === 'string' &&
      typeof item.prediction === 'string' &&
      typeof item.confidence === 'number' &&
      Number.isFinite(item.confidence)
  );
  if (valid.length === 0) {
    throw new Error('No valid studies found in this file.');
  }
  return valid.map((item) => ({
    ...item,
    displayName: sanitizeDisplayName(item.displayName || item.fileName),
    fileName: sanitizeDisplayName(item.displayName || item.fileName),
    patientId: sanitizePatientId(item.patientId),
    previewUrl: null,
    heatmap: null,
  }));
}
