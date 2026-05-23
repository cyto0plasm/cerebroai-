import { MOCK_DIAGNOSTIC_REPORTS, TUMOR_CLASSES } from '../constants';

export function buildScanRecord(scanResult, id = `scan-${Date.now()}`) {
  let findings = '';
  let severity = '';
  let recommendation = '';

  if (scanResult.prediction === TUMOR_CLASSES.TUMOR) {
    const type = scanResult.confidence > 0.9 ? 'HIGH_CONFIDENCE_TUMOR' : 'LOW_CONFIDENCE_TUMOR';
    findings = MOCK_DIAGNOSTIC_REPORTS[type].findings;
    severity = MOCK_DIAGNOSTIC_REPORTS[type].severity;
    recommendation = MOCK_DIAGNOSTIC_REPORTS[type].recommendation;
  } else {
    findings = MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.findings;
    severity = MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.severity;
    recommendation = MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.recommendation;
  }

  return {
    id,
    timestamp: new Date().toISOString(),
    fileName: scanResult.fileName,
    fileSize: scanResult.fileSize,
    previewUrl: scanResult.previewUrl ?? null,
    prediction: scanResult.prediction,
    confidence: scanResult.confidence,
    isMocked: scanResult.isMocked || false,
    heatmap: scanResult.heatmap || null,
    patientId: scanResult.patientId?.trim() || null,
    batchId: scanResult.batchId || null,
    sliceIndex: scanResult.sliceIndex ?? null,
    imageWidth: scanResult.imageWidth ?? null,
    imageHeight: scanResult.imageHeight ?? null,
    findings,
    severity,
    recommendation,
  };
}

export function loadHistoryFromStorage() {
  const saved = JSON.parse(localStorage.getItem('cerebro_scan_history')) || [];
  return saved
    .filter(item => !item.isMocked && !String(item.id || '').startsWith('scan-seed'))
    .map(item => ({
      ...item,
      previewUrl: item.previewUrl?.startsWith('blob:') ? null : item.previewUrl,
    }));
}

export function aggregateBatchPredictions(results) {
  const tumorVotes = results.filter(r => r.prediction === TUMOR_CLASSES.TUMOR).length;
  const total = results.length;
  const majorityTumor = tumorVotes > total / 2;
  const avgConf =
    results.reduce((s, r) => s + r.confidence, 0) / Math.max(total, 1);

  return {
    prediction: majorityTumor ? TUMOR_CLASSES.TUMOR : TUMOR_CLASSES.NO_TUMOR,
    confidence: Number(avgConf.toFixed(2)),
    tumorVotes,
    total,
  };
}
