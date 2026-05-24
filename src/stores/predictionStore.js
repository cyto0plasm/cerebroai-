import { defineStore } from 'pinia';
import { TUMOR_CLASSES } from '../constants';
import { buildScanRecord, aggregateBatchPredictions } from '../utils/scanRecord';
import { appendAuditEntry, clearAuditLog, loadAuditLog } from '../utils/auditLog';
import { useAuthStore } from './authStore';
import * as scanRepo from '../services/scanRepository';
import { sanitizeDisplayName, validateImportHistory } from '../utils/scanCloud';

export { aggregateBatchPredictions };

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    history: [],
    selectedHistoryId: null,
    patientIdInput: '',
    uploadMode: 'single',
    activeScan: { status: 'idle', progress: 0, error: null, result: null },
    batchSummary: null,
    syncing: false,
    workspaceError: null,
  }),

  getters: {
    currentInspectedScan(state) {
      if (state.selectedHistoryId) {
        const fromHistory = state.history.find((item) => item.id === state.selectedHistoryId);
        if (fromHistory) return fromHistory;
      }
      if (state.activeScan.status === 'success' && state.activeScan.result) {
        return state.activeScan.result;
      }
      return null;
    },

    stats(state) {
      const total = state.history.length;
      const tumors = state.history.filter((item) => item.prediction === TUMOR_CLASSES.TUMOR).length;
      const clearScans = total - tumors;
      const avgConfidence =
        total > 0
          ? Math.round((state.history.reduce((sum, item) => sum + item.confidence, 0) / total) * 100)
          : 0;
      return { total, tumors, clearScans, avgConfidence };
    },

    auditLog: () => loadAuditLog(),
    canPersist() {
      const auth = useAuthStore();
      return auth.isMember;
    },
  },

  actions: {
    async hydrateWorkspace() {
      const auth = useAuthStore();
      this.history = [];
      this.selectedHistoryId = null;

      if (auth.isMember && auth.user) {
        this.syncing = true;
        this.workspaceError = null;
        try {
          this.history = await scanRepo.fetchUserScans(auth.user.id);
          this.selectedHistoryId = this.history[0]?.id || null;
          this.workspaceError = null;
        } catch (e) {
          console.error('[CerebroAI] Failed to load workspace', e);
          this.workspaceError =
            e?.message?.includes('relation') || e?.code === '42P01'
              ? 'Cloud database not ready. Run supabase/schema.sql in your Supabase project.'
              : 'Could not load your cloud studies. Try signing out and back in.';
        } finally {
          this.syncing = false;
        }
      }
    },

    async addHistoryItem(scanResult) {
      const newScan = buildScanRecord({
        ...scanResult,
        patientId: scanResult.patientId || this.patientIdInput,
      });

      this.history.unshift(newScan);
      this.selectedHistoryId = newScan.id;

      const auth = useAuthStore();
      if (auth.isMember && auth.user) {
        try {
          await scanRepo.upsertScan(auth.user.id, newScan);
        } catch (e) {
          console.error('[CerebroAI] Cloud save failed', e);
          this.workspaceError = 'Study analyzed but cloud save failed. Check your connection or database setup.';
        }
      }

      if (auth.isMember) {
        appendAuditEntry({
          action: 'analysis_complete',
          scanId: newScan.id,
          displayName: newScan.displayName,
          prediction: newScan.prediction,
        });
      }

      return newScan;
    },

    async renameScan(id, displayName) {
      const name = sanitizeDisplayName(displayName);
      if (!name) return;

      const item = this.history.find((h) => h.id === id);
      if (!item) return;

      item.displayName = name;
      item.fileName = name;

      const auth = useAuthStore();
      if (auth.isMember && auth.user) {
        await scanRepo.updateScanName(auth.user.id, id, name);
      }

      if (this.activeScan.result?.id === id) {
        this.activeScan.result = { ...this.activeScan.result, displayName: name, fileName: name };
      }
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

    async deleteHistoryItem(id) {
      const auth = useAuthStore();
      if (auth.isMember && auth.user) {
        await scanRepo.deleteScan(auth.user.id, id);
      }
      this.history = this.history.filter((item) => item.id !== id);
      if (this.selectedHistoryId === id) {
        this.selectedHistoryId = this.history[0]?.id || null;
      }
    },

    async clearAllHistory() {
      const auth = useAuthStore();
      if (auth.isMember && auth.user) {
        await scanRepo.clearUserScans(auth.user.id);
      }
      this.history = [];
      this.selectedHistoryId = null;
    },

    async importSession(history, merge = true) {
      const auth = useAuthStore();
      if (!auth.isMember) return;

      const cleaned = validateImportHistory(history);

      if (merge) {
        const ids = new Set(this.history.map((h) => h.id));
        for (const item of cleaned) {
          if (!ids.has(item.id)) {
            this.history.push(item);
            if (auth.user) await scanRepo.upsertScan(auth.user.id, item);
          }
        }
      } else {
        this.history = cleaned;
        if (auth.user) {
          await scanRepo.clearUserScans(auth.user.id);
          for (const item of cleaned) {
            await scanRepo.upsertScan(auth.user.id, item);
          }
        }
      }
      this.selectedHistoryId = this.history[0]?.id || null;
    },

    purgeAuditLog() {
      clearAuditLog();
    },

    resetGuestSession() {
      this.history = [];
      this.selectedHistoryId = null;
      this.resetActiveScan();
      this.batchSummary = null;
    },
  },
});
