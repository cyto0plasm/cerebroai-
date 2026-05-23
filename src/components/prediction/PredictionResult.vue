<template>
  <!-- Empty state -->
  <div
    v-if="!scan"
    class="bg-white rounded-xl border border-dashed border-surface-200 p-10 flex flex-col items-center justify-center text-center min-h-[200px]"
  >
    <Brain class="w-8 h-8 text-surface-200 mb-3" />
    <p class="text-sm font-medium text-surface-400">Result will appear here</p>
    <p class="text-xs text-surface-300 mt-1">Upload a scan and click Run Analysis</p>
  </div>

  <!-- Result -->
  <div v-else data-tour="result" class="flex flex-col gap-4 animate-slide-up">

    <BatchSummary :summary="store.batchSummary" />

    <!-- Diagnosis header -->
    <div
      :class="[
        'rounded-xl border p-5',
        scan.prediction === 'Tumor' ? 'bg-danger-50 border-danger-200' : 'bg-success-50 border-success-200',
      ]"
    >
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              scan.prediction === 'Tumor' ? 'bg-danger-100' : 'bg-success-100',
            ]"
          >
            <component
              :is="scan.prediction === 'Tumor' ? AlertTriangle : CheckCircle"
              class="w-5 h-5"
              :class="scan.prediction === 'Tumor' ? 'text-danger-600' : 'text-success-600'"
            />
          </div>
          <div>
            <p
              class="text-xs font-medium mb-0.5"
              :class="scan.prediction === 'Tumor' ? 'text-danger-500' : 'text-success-500'"
            >
              Prediction
            </p>
            <p
              class="text-xl font-bold"
              :class="scan.prediction === 'Tumor' ? 'text-danger-800' : 'text-success-800'"
            >
              {{ scan.prediction === 'Tumor' ? 'Tumor detected' : 'No tumor detected' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2 shrink-0">
          <div class="text-right">
            <p
              class="text-2xl font-bold tabular-nums"
              :class="scan.prediction === 'Tumor' ? 'text-danger-700' : 'text-success-700'"
            >
              {{ Math.round(scan.confidence * 100) }}%
            </p>
            <p
              class="text-xs font-medium"
              :class="scan.prediction === 'Tumor' ? 'text-danger-400' : 'text-success-400'"
            >
              confidence
            </p>
          </div>
          <button
            type="button"
            @click="printScanReport(scan)"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 bg-white hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            Export / print report
          </button>
        </div>
      </div>
      <p v-if="scan.patientId" class="text-[11px] text-surface-500 mt-2 font-mono">Case ID: {{ scan.patientId }}</p>

      <div class="mt-4">
        <div
          class="h-1.5 rounded-full"
          :class="scan.prediction === 'Tumor' ? 'bg-danger-100' : 'bg-success-100'"
        >
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="scan.prediction === 'Tumor' ? 'bg-danger-500' : 'bg-success-500'"
            :style="{ width: strokeProgress + '%' }"
          ></div>
        </div>
      </div>

      <div
        v-if="scan.isMocked"
        class="mt-3 flex items-center gap-2 text-xs"
        :class="scan.prediction === 'Tumor' ? 'text-danger-400' : 'text-success-400'"
      >
        <Info class="w-3.5 h-3.5 shrink-0" />
        Simulated result — backend offline. Start the server for real predictions and plots.
      </div>
    </div>

    <!-- Collapsible real plots (hidden by default) -->
    <PredictionPlots v-if="hasAnyPlots" :scan="scan" />

    <div
      v-else-if="!scan.isMocked"
      class="rounded-xl border border-dashed border-surface-200 bg-surface-50 px-5 py-4 text-center"
    >
      <p class="text-xs text-surface-500">
        Visual plots unavailable — the server did not return a heatmap for this scan.
      </p>
    </div>

    <!-- Report -->
    <div class="bg-white rounded-xl border border-surface-200 shadow-card">
      <div class="px-5 py-3.5 border-b border-surface-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FileText class="w-4 h-4 text-surface-400" />
          <span class="text-sm font-semibold text-surface-900">Summary report</span>
        </div>
        <span
          v-if="scan.severity"
          :class="[
            'text-xs font-semibold px-2.5 py-1 rounded-full',
            scan.prediction === 'Tumor' ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600',
          ]"
        >
          {{ scan.severity }}
        </span>
      </div>

      <div class="p-5 flex flex-col gap-5">
        <div>
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Findings</p>
          <p class="text-sm text-surface-700 leading-relaxed">{{ scan.findings || '—' }}</p>
        </div>
        <div class="border-t border-surface-100 pt-4">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Recommendation</p>
          <p class="text-sm text-surface-700 leading-relaxed">{{ scan.recommendation || '—' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { Brain, AlertTriangle, CheckCircle, FileText, Info } from 'lucide-vue-next';
import PredictionPlots from './PredictionPlots.vue';
import BatchSummary from './BatchSummary.vue';
import { usePredictionStore } from '../../stores/predictionStore';
import { printScanReport } from '../../utils/exportReport';

const props = defineProps({ scan: { type: Object, default: null } });
const store = usePredictionStore();

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
