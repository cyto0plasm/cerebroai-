import { defineStore } from 'pinia';
import { TUMOR_CLASSES } from '../constants';
import { buildScanRecord, loadHistoryFromStorage, aggregateBatchPredictions } from '../utils/scanRecord';
import { appendAuditEntry, clearAuditLog, loadAuditLog } from '../utils/auditLog';

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    history: loadHistoryFromStorage(),
    selectedHistoryId: null,
    patientIdInput: '',
    uploadMode: 'single',
    activeScan: {
      status: 'idle',
      progress: 0,
      error: null,
      result: null,
    },
    batchSummary: null,
  }),

  getters: {
    currentInspectedScan: (state) => {
      if (state.selectedHistoryId) {
        const fromHistory = state.history.find(item => item.id === state.selectedHistoryId);
        if (fromHistory) return fromHistory;
      }
      if (state.activeScan.status === 'success' && state.activeScan.result) {
        return state.activeScan.result;
      }
      return null;
    },

    stats: (state) => {
      const total = state.history.length;
      const tumors = state.history.filter(item => item.prediction === TUMOR_CLASSES.TUMOR).length;
      const clearScans = total - tumors;
      const avgConfidence =
        total > 0
          ? Math.round((state.history.reduce((sum, item) => sum + item.confidence, 0) / total) * 100)
          : 0;
      return { total, tumors, clearScans, avgConfidence };
    },

    auditLog: () => loadAuditLog(),
  },

  actions: {
    addHistoryItem(scanResult) {
      const newScan = buildScanRecord({
        ...scanResult,
        patientId: scanResult.patientId || this.patientIdInput,
      });
      this.history.unshift(newScan);
      this.selectedHistoryId = newScan.id;
      this.saveToStorage();
      appendAuditEntry({
        action: 'analysis_complete',
        scanId: newScan.id,
        fileName: newScan.fileName,
        prediction: newScan.prediction,
        confidence: newScan.confidence,
        patientId: newScan.patientId,
        batchId: newScan.batchId,
      });
      return newScan;
    },

    setBatchSummary(summary) {
      this.batchSummary = summary;
    },

    clearBatchSummary() {
      this.batchSummary = null;
    },

    setHistorySelection(id) {
      this.selectedHistoryId = id;
      this.activeScan = { status: 'idle', progress: 0, error: null, result: null };
      this.batchSummary = null;
    },

    updateActiveScan(params) {
      this.activeScan = { ...this.activeScan, ...params };
    },

    resetActiveScan() {
      this.activeScan = { status: 'idle', progress: 0, error: null, result: null };
      this.batchSummary = null;
    },

    deleteHistoryItem(id) {
      this.history = this.history.filter(item => item.id !== id);
      if (this.selectedHistoryId === id) {
        this.selectedHistoryId = this.history[0]?.id || null;
      }
      this.saveToStorage();
      appendAuditEntry({ action: 'scan_deleted', scanId: id });
    },

    clearAllHistory() {
      this.history = [];
      this.selectedHistoryId = null;
      this.saveToStorage();
      appendAuditEntry({ action: 'history_cleared' });
    },

    importSession(history, merge = true) {
      const cleaned = (history || []).filter(
        item => item?.id && item?.prediction && item?.confidence != null
      );
      if (merge) {
        const ids = new Set(this.history.map(h => h.id));
        cleaned.forEach(item => {
          if (!ids.has(item.id)) this.history.push(item);
        });
      } else {
        this.history = cleaned;
      }
      this.selectedHistoryId = this.history[0]?.id || null;
      this.saveToStorage();
      appendAuditEntry({ action: 'session_imported', count: cleaned.length });
    },

    saveToStorage() {
      localStorage.setItem('cerebro_scan_history', JSON.stringify(this.history));
    },

    purgeAuditLog() {
      clearAuditLog();
    },
  },
});
