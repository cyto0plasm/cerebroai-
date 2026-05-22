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
  <div v-else class="flex flex-col gap-4 animate-slide-up">

    <!-- Diagnosis header -->
    <div
      :class="[
        'rounded-xl border p-5',
        scan.prediction === 'Tumor' ? 'bg-danger-50 border-danger-200' : 'bg-success-50 border-success-200'
      ]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', scan.prediction === 'Tumor' ? 'bg-danger-100' : 'bg-success-100']">
            <component :is="scan.prediction === 'Tumor' ? AlertTriangle : CheckCircle" class="w-5 h-5" :class="scan.prediction === 'Tumor' ? 'text-danger-600' : 'text-success-600'" />
          </div>
          <div>
            <p class="text-xs font-medium mb-0.5" :class="scan.prediction === 'Tumor' ? 'text-danger-500' : 'text-success-500'">AI Diagnosis</p>
            <p class="text-xl font-bold" :class="scan.prediction === 'Tumor' ? 'text-danger-800' : 'text-success-800'">
              {{ scan.prediction === 'Tumor' ? 'Tumor detected' : 'No tumor detected' }}
            </p>
          </div>
        </div>

        <!-- Confidence pill -->
        <div class="text-right shrink-0">
          <p class="text-2xl font-bold" :class="scan.prediction === 'Tumor' ? 'text-danger-700' : 'text-success-700'">
            {{ Math.round(scan.confidence * 100) }}%
          </p>
          <p class="text-xs font-medium" :class="scan.prediction === 'Tumor' ? 'text-danger-400' : 'text-success-400'">
            confidence
          </p>
        </div>
      </div>

      <!-- Confidence bar -->
      <div class="mt-4">
        <div class="h-1.5 rounded-full" :class="scan.prediction === 'Tumor' ? 'bg-danger-100' : 'bg-success-100'">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="scan.prediction === 'Tumor' ? 'bg-danger-500' : 'bg-success-500'"
            :style="{ width: strokeProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Simulated warning -->
      <div v-if="scan.isMocked" class="mt-3 flex items-center gap-2 text-xs" :class="scan.prediction === 'Tumor' ? 'text-danger-400' : 'text-success-400'">
        <Info class="w-3.5 h-3.5 shrink-0" />
        Simulated result — backend offline. Start the server for real predictions.
      </div>
    </div>

    <!-- Heatmap -->
    <div v-if="scan.heatmap" class="bg-white rounded-xl border border-surface-200 shadow-card overflow-hidden">
      <div class="px-5 py-3.5 border-b border-surface-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <ScanLine class="w-4 h-4 text-surface-400" />
          <span class="text-sm font-semibold text-surface-900">Activation Map</span>
        </div>
        <span class="text-xs text-surface-400">Red/yellow = high activation · Blue = low</span>
      </div>
      <div class="relative">
        <img :src="scan.heatmap" alt="Grad-CAM heatmap" class="w-full object-contain max-h-72" />
        <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-surface-200 rounded-lg px-3 py-1.5 text-xs text-surface-600 font-medium">
          Grad-CAM — areas the model focused on
        </div>
      </div>
    </div>

    <!-- Report -->
    <div class="bg-white rounded-xl border border-surface-200 shadow-card">
      <div class="px-5 py-3.5 border-b border-surface-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FileText class="w-4 h-4 text-surface-400" />
          <span class="text-sm font-semibold text-surface-900">Pathology Report</span>
        </div>
        <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', scan.prediction === 'Tumor' ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600']">
          {{ scan.severity }}
        </span>
      </div>

      <div class="p-5 flex flex-col gap-5">
        <div>
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Findings</p>
          <p class="text-sm text-surface-700 leading-relaxed">{{ scan.findings }}</p>
        </div>
        <div class="border-t border-surface-100 pt-4">
          <p class="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-2">Recommendation</p>
          <p class="text-sm text-surface-700 leading-relaxed">{{ scan.recommendation }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Brain, AlertTriangle, CheckCircle, FileText, Info, ScanLine } from 'lucide-vue-next';

const props = defineProps({ scan: { type: Object, default: null } });

const strokeProgress = ref(0);
const animateBar = () => {
  if (!props.scan) return;
  strokeProgress.value = 0;
  setTimeout(() => { strokeProgress.value = Math.round(props.scan.confidence * 100); }, 80);
};
watch(() => props.scan?.id, animateBar);
onMounted(animateBar);
</script>
