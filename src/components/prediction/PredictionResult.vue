<template>
  <!-- Empty state -->
  <div
    v-if="!scan"
    class="panel rounded-xl border-dashed p-10 flex flex-col items-center justify-center text-center min-h-[200px]"
  >
    <ScanLine class="w-8 h-8 text-surface-300 dark:text-surface-600 mb-3" />
    <p class="text-sm font-medium text-surface-400 dark:text-surface-500">Result will appear here</p>
    <p class="text-xs text-surface-300 dark:text-surface-600 mt-1">Upload a scan and click Run Analysis</p>
  </div>

  <!-- Result -->
  <div v-else data-tour="result" class="flex flex-col gap-4 animate-slide-up">

    <BatchSummary :summary="store.batchSummary" />

    <!-- Diagnosis header -->
    <div :class="['result-card', isTumor ? 'result-card--tumor' : 'result-card--clear']">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'result-icon w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              isTumor ? 'result-icon--tumor' : 'result-icon--clear',
            ]"
          >
            <component
              :is="isTumor ? AlertTriangle : CheckCircle"
              class="w-5 h-5"
            />
          </div>
          <div>
            <p class="result-label text-xs font-medium mb-0.5">Prediction</p>
            <p class="result-title text-xl font-bold">
              {{ isTumor ? 'Tumor detected' : 'No tumor detected' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 shrink-0">
          <div class="text-right">
            <p class="result-confidence text-2xl font-bold tabular-nums">
              {{ Math.round(scan.confidence * 100) }}%
            </p>
            <p class="result-label text-xs font-medium">confidence</p>
          </div>
          <button
            type="button"
            @click="printScanReport(scan)"
            class="result-export-btn text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Export / print report
          </button>
        </div>
      </div>
      <p v-if="scan.patientId" class="text-[11px] text-surface-600 dark:text-surface-300 mt-2 font-mono">Case ID: {{ scan.patientId }}</p>

      <div class="mt-4">
        <div class="result-progress-track h-1.5 rounded-full" :class="isTumor ? 'result-progress-track--tumor' : 'result-progress-track--clear'">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="isTumor ? 'bg-danger-500' : 'bg-success-500'"
            :style="{ width: strokeProgress + '%' }"
          ></div>
        </div>
      </div>

    </div>

    <PredictionPlots v-if="hasAnyPlots" :scan="scan" />

    <div
      v-else
      class="panel px-5 py-4 text-center"
    >
      <p class="text-xs text-surface-500 dark:text-surface-400">
        Visual plots unavailable — the server did not return a heatmap for this scan.
      </p>
    </div>

    <!-- Report -->
    <div class="panel rounded-xl">
      <div class="px-5 py-3.5 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FileText class="w-4 h-4 text-surface-400" />
          <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">Summary report</span>
        </div>
        <span
          v-if="scan.severity"
          :class="['result-severity text-xs font-semibold px-2.5 py-1 rounded-full', isTumor ? 'result-severity--tumor' : 'result-severity--clear']"
        >
          {{ scan.severity }}
        </span>
      </div>

      <div class="p-5 flex flex-col gap-5">
        <div>
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Findings</p>
          <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ scan.findings || '—' }}</p>
        </div>
        <div class="border-t border-surface-100 dark:border-surface-700 pt-4">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Recommendation</p>
          <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ scan.recommendation || '—' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { ScanLine, AlertTriangle, CheckCircle, FileText } from 'lucide-vue-next';
import PredictionPlots from './PredictionPlots.vue';
import BatchSummary from './BatchSummary.vue';
import { usePredictionStore } from '../../stores/predictionStore';
import { printScanReport } from '../../utils/exportReport';

const props = defineProps({ scan: { type: Object, default: null } });
const store = usePredictionStore();

const isTumor = computed(() => props.scan?.prediction === 'Tumor');

const hasAnyPlots = computed(() => {
  if (!props.scan) return false;
  return Boolean(props.scan.previewUrl || props.scan.heatmap || props.scan.confidence != null);
});

const strokeProgress = ref(0);
const animateBar = () => {
  if (!props.scan) return;
  strokeProgress.value = 0;
  setTimeout(() => {
    strokeProgress.value = Math.round(props.scan.confidence * 100);
  }, 80);
};
watch(() => props.scan?.id, animateBar);
onMounted(animateBar);
</script>
