<template>
  <Teleport to="body">
    <div
      v-if="open && scan"
      class="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @keydown.escape="close"
    >
      <div class="absolute inset-0 bg-surface-950/70 backdrop-blur-sm" aria-hidden="true" @click="close" />

      <div
        class="relative z-10 w-full sm:max-w-2xl flex flex-col min-h-0 h-[min(100dvh,100%)] sm:h-auto sm:max-h-[min(88vh,720px)] bg-surface-0 dark:bg-surface-900 rounded-t-2xl sm:rounded-2xl border border-surface-200 dark:border-surface-700 shadow-card-lg animate-slide-up"
      >
        <header class="shrink-0 px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p :id="titleId" class="font-display text-lg font-bold text-surface-900 dark:text-surface-50 truncate">
              {{ scan.displayName || scan.fileName }}
            </p>
            <p class="text-xs text-surface-500 mt-0.5">{{ formatDate(scan.timestamp) }}</p>
          </div>
          <button
            type="button"
            class="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
            aria-label="Close"
            @click="close"
          >
            <X class="w-5 h-5" />
          </button>
        </header>

        <div class="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-5 py-5 flex flex-col gap-5">
          <div
            :class="[
              'rounded-xl border p-4 flex items-center gap-4',
              scan.prediction === 'Tumor'
                ? 'bg-danger-50 dark:bg-danger-950/30 border-danger-200 dark:border-danger-800'
                : 'bg-success-50 dark:bg-success-950/30 border-success-200 dark:border-success-800',
            ]"
          >
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                scan.prediction === 'Tumor' ? 'bg-danger-100 dark:bg-danger-900/50' : 'bg-success-100 dark:bg-success-900/50',
              ]"
            >
              <component
                :is="scan.prediction === 'Tumor' ? AlertTriangle : CheckCircle"
                class="w-6 h-6"
                :class="scan.prediction === 'Tumor' ? 'text-danger-600' : 'text-success-600'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-surface-500 uppercase tracking-wide">Screening result</p>
              <p class="text-lg font-bold text-surface-900 dark:text-surface-50">
                {{ scan.prediction === 'Tumor' ? 'Tumor detected' : 'No tumor detected' }}
              </p>
              <p class="text-sm text-surface-600 dark:text-surface-400 mt-0.5">
                {{ Math.round((scan.confidence || 0) * 100) }}% confidence
                <span v-if="scan.severity"> · {{ scan.severity }}</span>
              </p>
            </div>
          </div>

          <dl class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div class="panel p-3 !shadow-none">
              <dt class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold">Study ID</dt>
              <dd class="font-mono text-xs text-surface-700 dark:text-surface-300 mt-1 truncate" :title="scan.id">{{ scan.id }}</dd>
            </div>
            <div v-if="scan.patientId" class="panel p-3 !shadow-none">
              <dt class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold">Case ID</dt>
              <dd class="font-mono text-xs text-surface-700 dark:text-surface-300 mt-1">{{ scan.patientId }}</dd>
            </div>
            <div v-if="scan.fileSize" class="panel p-3 !shadow-none">
              <dt class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold">File size</dt>
              <dd class="text-xs text-surface-700 dark:text-surface-300 mt-1">{{ formatBytes(scan.fileSize) }}</dd>
            </div>
            <div v-if="scan.imageWidth" class="panel p-3 !shadow-none">
              <dt class="text-[10px] uppercase tracking-wide text-surface-400 font-semibold">Dimensions</dt>
              <dd class="text-xs text-surface-700 dark:text-surface-300 mt-1">{{ scan.imageWidth }}×{{ scan.imageHeight }}</dd>
            </div>
          </dl>

          <div class="flex flex-col gap-4">
            <section>
              <h3 class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Findings</h3>
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ scan.findings || '—' }}</p>
            </section>
            <section>
              <h3 class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Recommendation</h3>
              <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ scan.recommendation || '—' }}</p>
            </section>
          </div>

          <PredictionPlots v-if="hasPlots" :scan="scan" />

          <p
            v-else
            class="text-xs text-surface-500 bg-surface-50 dark:bg-surface-800/50 rounded-lg px-3 py-2 border border-surface-100 dark:border-surface-700"
          >
            Visual maps are not stored in the cloud. Open this study in the workspace after a new analysis to view plots, or they appear here for current-session studies.
          </p>
        </div>

        <footer class="shrink-0 px-5 py-4 border-t border-surface-100 dark:border-surface-700 flex flex-wrap gap-2">
          <BaseButton variant="primary" size="sm" @click="openInWorkspace">Open in workspace</BaseButton>
          <BaseButton variant="outline" size="sm" @click="exportReport">Export report</BaseButton>
          <BaseButton
            v-if="canDelete"
            variant="ghost"
            size="sm"
            class="text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/40 ml-auto"
            @click="confirmDelete"
          >
            Delete study
          </BaseButton>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { X, AlertTriangle, CheckCircle } from 'lucide-vue-next';
import PredictionPlots from '../prediction/PredictionPlots.vue';
import BaseButton from '../ui/BaseButton.vue';
import { printScanReport } from '../../utils/exportReport';

const props = defineProps({
  open: { type: Boolean, default: false },
  scan: { type: Object, default: null },
  canDelete: { type: Boolean, default: true },
});

const emit = defineEmits(['close', 'delete', 'open-workspace']);

const router = useRouter();
const titleId = 'scan-detail-title';

const hasPlots = computed(() => {
  if (!props.scan) return false;
  return Boolean(props.scan.previewUrl || props.scan.heatmap || props.scan.confidence != null);
});

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
);

function close() {
  emit('close');
}

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatBytes(n) {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function openInWorkspace() {
  emit('open-workspace', props.scan?.id);
  router.push({ name: 'dashboard' });
  close();
}

function exportReport() {
  if (props.scan) printScanReport(props.scan);
}

function confirmDelete() {
  if (!props.scan) return;
  const name = props.scan.displayName || props.scan.fileName || 'this study';
  if (window.confirm(`Delete "${name}" from your workspace? This cannot be undone.`)) {
    emit('delete', props.scan.id);
    close();
  }
}
</script>
