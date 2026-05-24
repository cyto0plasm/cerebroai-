import { CLINICAL_REPORTS, TUMOR_CLASSES } from '../constants';
import { sanitizeDisplayName, sanitizePatientId } from './scanCloud';

export function buildScanRecord(scanResult, id = `scan-${Date.now()}`) {
  let findings = '';
  let severity = '';
  let recommendation = '';

  if (scanResult.prediction === TUMOR_CLASSES.TUMOR) {
    const type = scanResult.confidence > 0.9 ? 'HIGH_CONFIDENCE_TUMOR' : 'LOW_CONFIDENCE_TUMOR';
    findings = CLINICAL_REPORTS[type].findings;
    severity = CLINICAL_REPORTS[type].severity;
    recommendation = CLINICAL_REPORTS[type].recommendation;
  } else {
    findings = CLINICAL_REPORTS.NO_TUMOR.findings;
    severity = CLINICAL_REPORTS.NO_TUMOR.severity;
    recommendation = CLINICAL_REPORTS.NO_TUMOR.recommendation;
  }

  const displayName = sanitizeDisplayName(scanResult.displayName || scanResult.fileName) || 'Study';

  return {
    id,
    timestamp: new Date().toISOString(),
    fileName: displayName,
    displayName,
    fileSize: scanResult.fileSize,
    previewUrl: scanResult.previewUrl ?? null,
    prediction: scanResult.prediction,
    confidence: scanResult.confidence,
    heatmap: scanResult.heatmap || null,
    patientId: sanitizePatientId(scanResult.patientId),
    batchId: scanResult.batchId || null,
    sliceIndex: scanResult.sliceIndex ?? null,
    imageWidth: scanResult.imageWidth ?? null,
    imageHeight: scanResult.imageHeight ?? null,
    findings,
    severity,
    recommendation,
  };
}

export function aggregateBatchPredictions(results) {
  const tumorVotes = results.filter((r) => r.prediction === TUMOR_CLASSES.TUMOR).length;
  const total = results.length;
  const majorityTumor = tumorVotes > total / 2;
  const avgConf = results.reduce((s, r) => s + r.confidence, 0) / Math.max(total, 1);

  return {
    prediction: majorityTumor ? TUMOR_CLASSES.TUMOR : TUMOR_CLASSES.NO_TUMOR,
    confidence: Number(avgConf.toFixed(2)),
    tumorVotes,
    total,
  };
}
