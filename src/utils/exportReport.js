import { CONFIG } from '../config';

export function printScanReport(scan) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) {
    alert('Allow pop-ups to print or export the report.');
    return;
  }

  const date = new Date(scan.timestamp).toLocaleString();
  const conf = Math.round((scan.confidence || 0) * 100);
  const name = scan.displayName || scan.fileName;
  const patient = scan.patientId
    ? `<tr><th>Case ID</th><td>${escapeHtml(scan.patientId)}</td></tr>`
    : '';
  const heatmap = scan.heatmap
    ? `<figure><figcaption>Activation map</figcaption><img src="${scan.heatmap}" alt="Heatmap" style="max-width:100%;border-radius:8px"/></figure>`
    : '';
  const preview = scan.previewUrl
    ? `<figure><figcaption>Source slice</figcaption><img src="${scan.previewUrl}" alt="Source" style="max-width:100%;border-radius:8px"/></figure>`
    : '';

  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${CONFIG.APP_NAME} — ${escapeHtml(name)}</title>
<style>
  body{font-family:system-ui,sans-serif;color:#1a1816;padding:32px;max-width:720px;margin:0 auto;line-height:1.55}
  h1{font-size:1.2rem;color:#173532}
  table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
  th,td{border:1px solid #d9d2c6;padding:8px 12px;text-align:left}
  th{background:#f6f3ee;width:140px}
  .banner{margin-top:24px;padding:12px;border-radius:8px;background:#fdf3f2;font-size:12px}
</style></head><body>
  <h1>${CONFIG.APP_NAME} — Screening report</h1>
  <p style="color:#6f655a;font-size:12px">${date}</p>
  <table>
    <tr><th>Study</th><td>${escapeHtml(name)}</td></tr>
    ${patient}
    <tr><th>Result</th><td><strong>${escapeHtml(scan.prediction)}</strong></td></tr>
    <tr><th>Confidence</th><td>${conf}%</td></tr>
    <tr><th>Level</th><td>${escapeHtml(scan.severity || '—')}</td></tr>
  </table>
  <h2>Findings</h2><p>${escapeHtml(scan.findings || '—')}</p>
  <h2>Recommendation</h2><p>${escapeHtml(scan.recommendation || '—')}</p>
  ${preview}${heatmap}
  <div class="banner"><strong>Not for clinical use.</strong> Screening output only — requires qualified interpretation.</div>
  <script>window.onload=function(){window.print()}</script>
</body></html>`);
  win.document.close();
}

export function downloadSessionJson(history, auditLog) {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: CONFIG.APP_NAME,
    version: CONFIG.VERSION,
    history,
    auditLog,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `axialmri-session-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
