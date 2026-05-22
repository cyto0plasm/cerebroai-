import { defineStore } from 'pinia';
import { MOCK_DIAGNOSTIC_REPORTS, TUMOR_CLASSES } from '../constants';

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    history: (() => {
      const saved = JSON.parse(localStorage.getItem('cerebro_scan_history')) || [];
      // Blob URLs are revoked on page reload — strip them to prevent ERR_FILE_NOT_FOUND
      return saved.map(item => ({
        ...item,
        previewUrl: item.previewUrl?.startsWith('blob:') ? null : item.previewUrl
      }));
    })(),
    selectedHistoryId: null,
    activeScan: {
      status: 'idle', // idle, validating, uploading, scanning, success, error
      progress: 0,
      error: null,
      result: null
    }
  }),
  
  getters: {
    // Retrieves details of the currently inspected scan
    currentInspectedScan: (state) => {
      if (state.activeScan.status === 'success' && state.activeScan.result) {
        return state.activeScan.result;
      }
      return state.history.find(item => item.id === state.selectedHistoryId) || null;
    },
    
    // Computes dynamic clinic statistics
    stats: (state) => {
      const total = state.history.length;
      const tumors = state.history.filter(item => item.prediction === TUMOR_CLASSES.TUMOR).length;
      const clearScans = total - tumors;
      const avgConfidence = total > 0 
        ? Math.round((state.history.reduce((sum, item) => sum + item.confidence, 0) / total) * 100)
        : 0;
        
      return {
        total,
        tumors,
        clearScans,
        avgConfidence
      };
    }
  },
  
  actions: {
    // Add a completed telemetry scan to local history database
    addHistoryItem(scanResult) {
      // Find findings and severity based on prediction class and confidence
      let findings = '';
      let severity = '';
      let recommendation = '';
      
      if (scanResult.prediction === TUMOR_CLASSES.TUMOR) {
        const type = scanResult.confidence > 0.90 ? 'HIGH_CONFIDENCE_TUMOR' : 'LOW_CONFIDENCE_TUMOR';
        findings = MOCK_DIAGNOSTIC_REPORTS[type].findings;
        severity = MOCK_DIAGNOSTIC_REPORTS[type].severity;
        recommendation = MOCK_DIAGNOSTIC_REPORTS[type].recommendation;
      } else {
        findings = MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.findings;
        severity = MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.severity;
        recommendation = MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.recommendation;
      }
      
      const newScan = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        fileName: scanResult.fileName,
        fileSize: scanResult.fileSize,
        previewUrl: scanResult.previewUrl,
        prediction: scanResult.prediction,
        confidence: scanResult.confidence,
        isMocked: scanResult.isMocked || false,
        heatmap: scanResult.heatmap || null,
        findings,
        severity,
        recommendation
      };
      
      this.history.unshift(newScan);
      this.selectedHistoryId = newScan.id;
      this.saveToStorage();
    },
    
    // Select an item from the history panel to display in the main dashboard view
    setHistorySelection(id) {
      this.selectedHistoryId = id;
      // Reset active scan when viewing history to avoid overlap
      this.activeScan = {
        status: 'idle',
        progress: 0,
        error: null,
        result: null
      };
    },
    
    // Set active scan state parameters
    updateActiveScan(params) {
      this.activeScan = { ...this.activeScan, ...params };
    },
    
    // Clear active prediction run
    resetActiveScan() {
      this.activeScan = {
        status: 'idle',
        progress: 0,
        error: null,
        result: null
      };
    },
    
    // Delete a specific scan item from history
    deleteHistoryItem(id) {
      this.history = this.history.filter(item => item.id !== id);
      if (this.selectedHistoryId === id) {
        this.selectedHistoryId = this.history[0]?.id || null;
      }
      this.saveToStorage();
    },
    
    // Clear clinical database
    clearAllHistory() {
      this.history = [];
      this.selectedHistoryId = null;
      this.saveToStorage();
    },
    
    // Saves history state into browser local storage
    saveToStorage() {
      localStorage.setItem('cerebro_scan_history', JSON.stringify(this.history));
    },
    
    // Seeds high-fidelity clinical data initially to impress user upon first load
    seedMockHistory() {
      if (this.history.length > 0) return;
      
      const seedScans = [
        {
          id: 'scan-seed-1',
          timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(), // 32 minutes ago
          fileName: 'patient_mri_axial_t2_982.png',
          fileSize: 452030,
          previewUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=500&auto=format&fit=crop&q=60',
          prediction: TUMOR_CLASSES.TUMOR,
          confidence: 0.94,
          isMocked: true,
          findings: MOCK_DIAGNOSTIC_REPORTS.HIGH_CONFIDENCE_TUMOR.findings,
          severity: MOCK_DIAGNOSTIC_REPORTS.HIGH_CONFIDENCE_TUMOR.severity,
          recommendation: MOCK_DIAGNOSTIC_REPORTS.HIGH_CONFIDENCE_TUMOR.recommendation
        },
        {
          id: 'scan-seed-2',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          fileName: 'patient_mri_sagittal_t1_401.jpg',
          fileSize: 312500,
          previewUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=60',
          prediction: TUMOR_CLASSES.NO_TUMOR,
          confidence: 0.98,
          isMocked: true,
          findings: MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.findings,
          severity: MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.severity,
          recommendation: MOCK_DIAGNOSTIC_REPORTS.NO_TUMOR.recommendation
        }
      ];
      
      this.history = seedScans;
      this.selectedHistoryId = seedScans[0].id;
      this.saveToStorage();
    }
  }
});
