const AUDIT_KEY = 'cerebro_audit_log';
const MAX_ENTRIES = 200;

export function loadAuditLog() {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY)) || [];
  } catch {
    return [];
  }
}

export function appendAuditEntry(entry) {
  const log = loadAuditLog();
  log.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  localStorage.setItem(AUDIT_KEY, JSON.stringify(log.slice(0, MAX_ENTRIES)));
}

export function clearAuditLog() {
  localStorage.removeItem(AUDIT_KEY);
}

export function exportAuditLogJson() {
  return JSON.stringify(loadAuditLog(), null, 2);
}
