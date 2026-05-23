import { defineStore } from 'pinia';
import { TUMOR_CLASSES } from '../constants';
import { buildScanRecord, loadHistoryFromStorage } from '../utils/scanRecord';

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    history: loadHistoryFromStorage(),
    selectedHistoryId: null,
    activeScan: {
      status: 'idle',
      progress: 0,
      error: null,
      result: null,
    },
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
  },

  actions: {
    addHistoryItem(scanResult) {
      const newScan = buildScanRecord(scanResult);
      this.history.unshift(newScan);
      this.selectedHistoryId = newScan.id;
      this.saveToStorage();
      return newScan;
    },

    setHistorySelection(id) {
      this.selectedHistoryId = id;
      this.activeScan = {
        status: 'idle',
        progress: 0,
        error: null,
        result: null,
      };
    },

    updateActiveScan(params) {
      this.activeScan = { ...this.activeScan, ...params };
    },

    resetActiveScan() {
      this.activeScan = {
        status: 'idle',
        progress: 0,
        error: null,
        result: null,
      };
    },

    deleteHistoryItem(id) {
      this.history = this.history.filter(item => item.id !== id);
      if (this.selectedHistoryId === id) {
        this.selectedHistoryId = this.history[0]?.id || null;
      }
      this.saveToStorage();
    },

    clearAllHistory() {
      this.history = [];
      this.selectedHistoryId = null;
      this.saveToStorage();
    },

    saveToStorage() {
      localStorage.setItem('cerebro_scan_history', JSON.stringify(this.history));
    },
  },
});
