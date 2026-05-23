import { CONFIG } from '../config';

export function printScanReport(scan) {
  if (!scan) {
    alert('No scan available to export.');
    return;
  }

  const html = buildReportHtml(scan);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');

  if (!win) {
    URL.revokeObjectURL(url);
    alert('Allow pop-ups to print or export the report.');
    return;
  }

  win.addEventListener(
    'load',
    () => {
      URL.revokeObjectURL(url);
      win.focus();
      win.print();
    },
    { once: true }
  );
}

function buildReportHtml(scan) {
  const date = scan.timestamp ? new Date(scan.timestamp).toLocaleString() : new Date().toLocaleString();
  const conf = Math.round((scan.confidence || 0) * 100);
  const name = scan.displayName || scan.fileName || 'Study';
  const patient = scan.patientId
    ? `<tr><th>Case ID</th><td>${escapeHtml(scan.patientId)}</td></tr>`
    : '';
  const heatmap = scan.heatmap
    ? `<figure><figcaption>Activation map</figcaption><img src="${safeAttr(scan.heatmap)}" alt="Heatmap" style="max-width:100%;border-radius:8px"/></figure>`
    : '';
  const preview = scan.previewUrl
    ? `<figure><figcaption>Source slice</figcaption><img src="${safeAttr(scan.previewUrl)}" alt="Source" style="max-width:100%;border-radius:8px"/></figure>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(CONFIG.APP_NAME)} — ${escapeHtml(name)}</title>
  <style>
    body{font-family:system-ui,sans-serif;color:#1a1816;padding:32px;max-width:720px;margin:0 auto;line-height:1.55}
    h1{font-size:1.2rem;color:#0f172a}
    table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
    th,td{border:1px solid #cbd5e1;padding:8px 12px;text-align:left}
    th{background:#f1f5f9;width:140px}
    .banner{margin-top:24px;padding:12px;border-radius:8px;background:#fdf3f2;font-size:12px}
    figure{margin:16px 0}
    figcaption{font-size:12px;color:#64748b;margin-bottom:6px}
  </style>
</head>
<body>
  <h1>${escapeHtml(CONFIG.APP_NAME)} — Screening report</h1>
  <p style="color:#64748b;font-size:12px">${escapeHtml(date)}</p>
  <table>
    <tr><th>Study</th><td>${escapeHtml(name)}</td></tr>
    ${patient}
    <tr><th>Result</th><td><strong>${escapeHtml(scan.prediction || '—')}</strong></td></tr>
    <tr><th>Confidence</th><td>${conf}%</td></tr>
    <tr><th>Level</th><td>${escapeHtml(scan.severity || '—')}</td></tr>
  </table>
  <h2>Findings</h2><p>${escapeHtml(scan.findings || '—')}</p>
  <h2>Recommendation</h2><p>${escapeHtml(scan.recommendation || '—')}</p>
  ${preview}${heatmap}
  <div class="banner"><strong>Not for clinical use.</strong> Screening output only — requires qualified interpretation.</div>
</body>
</html>`;
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
  a.download = `cerebroai-session-${Date.now()}.json`;
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

function safeAttr(url) {
  return String(url).replace(/"/g, '&quot;');
}
