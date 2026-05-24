<template>
  <div class="panel rounded-xl">
    <div class="px-5 py-3 border-b border-surface-100 dark:border-surface-700">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">Session &amp; data</h3>
    </div>
    <div class="p-4 flex flex-wrap gap-2">
      <button
        type="button"
        @click="exportSession"
        class="text-xs font-semibold px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        Export session JSON
      </button>
      <label class="text-xs font-semibold px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer focus-within:ring-2 focus-within:ring-brand-500">
        Import session
        <input type="file" accept=".json,application/json" class="hidden" @change="importSession" />
      </label>
      <button
        type="button"
        @click="downloadAudit"
        class="text-xs font-semibold px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        Export audit log
      </button>
      <button
        type="button"
        @click="purgeAudit"
        class="text-xs font-semibold px-3 py-2 rounded-lg border border-danger-200 text-danger-600 hover:bg-danger-50 focus:outline-none focus:ring-2 focus:ring-danger-500"
      >
        Clear audit log
      </button>
    </div>
    <p v-if="importMsg" class="px-4 pb-3 text-xs text-success-600">{{ importMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePredictionStore } from '../../stores/predictionStore';
import { downloadSessionJson } from '../../utils/exportReport';
import { exportAuditLogJson } from '../../utils/auditLog';

const store = usePredictionStore();
const importMsg = ref('');

function exportSession() {
  downloadSessionJson(store.history, store.auditLog);
}

function downloadAudit() {
  const blob = new Blob([exportAuditLogJson()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cerebroai-audit-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function purgeAudit() {
  if (confirm('Clear local audit log?')) {
    store.purgeAuditLog();
  }
}

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

async function importSession(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > MAX_IMPORT_BYTES) {
    importMsg.value = 'File too large (max 2 MB).';
    e.target.value = '';
    return;
  }
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const history = data.history || data;
    await store.importSession(history, true);
    importMsg.value = `Imported successfully.`;
    setTimeout(() => { importMsg.value = ''; }, 4000);
  } catch (err) {
    importMsg.value = err.message || 'Import failed.';
  }
  e.target.value = '';
}
</script>
