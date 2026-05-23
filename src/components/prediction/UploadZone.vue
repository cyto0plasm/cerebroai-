<template>
  <div class="flex flex-col gap-4">

    <!-- Mode + case ID -->
    <div class="flex flex-col sm:flex-row gap-3" data-tour="patient-id">
      <div class="flex rounded-lg border border-surface-200 dark:border-surface-600 p-0.5 bg-surface-50 dark:bg-surface-900 shrink-0">
        <button
          type="button"
          :class="modeBtn('single')"
          @click="store.uploadMode = 'single'; clearSelection()"
        >
          Single slice
        </button>
        <button
          type="button"
          :class="modeBtn('series')"
          @click="store.uploadMode = 'series'; clearSelection()"
        >
          Multi-slice (≤8)
        </button>
      </div>
      <label class="flex-1 text-xs">
        <span class="font-medium text-surface-600 dark:text-surface-400">Case ID (optional, anonymous)</span>
        <input
          v-model="store.patientIdInput"
          type="text"
          maxlength="32"
          placeholder="e.g. CASE-2026-001"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </label>
    </div>

    <div
      data-tour="upload"
      @dragover="(e) => handleDragOver(e)"
      @dragleave="handleDragLeave"
      @drop="(e) => handleDrop(e, isSeries)"
      :class="[
        'relative border-2 border-dashed rounded-xl transition-colors duration-150 select-none',
        isDragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-950/20' :
        uploadError ? 'border-danger-300 bg-danger-50' :
        previewUrl ? 'border-surface-200 bg-white dark:bg-surface-800 p-0 overflow-hidden' :
        'border-surface-200 bg-surface-50 dark:bg-surface-900 hover:border-brand-300 cursor-pointer',
      ]"
      @click="!previewUrl && !processing ? $refs.fileInput.click() : null"
    >
      <div v-if="processing" class="flex items-center justify-center py-16 gap-2 text-sm text-surface-500">
        <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Processing file…
      </div>

      <div v-else-if="previewUrl" class="flex flex-col sm:flex-row">
        <div class="relative sm:w-48 h-48 shrink-0 bg-surface-900 overflow-hidden">
          <img :src="previewUrl" alt="MRI preview" class="w-full h-full object-cover" />
          <div
            v-if="store.activeScan.status === 'scanning'"
            class="absolute inset-0 bg-surface-900/70 flex flex-col items-center justify-center gap-2"
          >
            <svg class="animate-spin w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="text-xs text-white font-medium">{{ progressLabel }}</span>
            <span v-if="slowRequest" class="text-[10px] text-surface-300 text-center px-2">Server waking up…</span>
          </div>
          <div v-if="store.activeScan.status === 'success'" class="absolute top-2 right-2">
            <div class="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between p-4 flex-1 min-w-0">
          <div>
            <p class="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
              {{ isSeries ? `${selectedFiles.length} files selected` : selectedFile?.name }}
            </p>
            <p class="text-xs text-surface-400">
              <template v-if="imageMeta">{{ imageMeta.width }}×{{ imageMeta.height }} · </template>
              {{ isSeries ? 'series mode' : `${((selectedFile?.size || 0) / 1024).toFixed(0)} KB` }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-4">
            <button
              v-if="canReset"
              type="button"
              @click.stop="triggerReset"
              class="text-xs text-surface-400 hover:text-surface-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded"
            >
              <X class="w-3.5 h-3.5" /> Remove
            </button>
            <button
              v-if="store.activeScan.status === 'idle'"
              type="button"
              @click.stop="submitScan"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <Play class="w-3.5 h-3.5" /> Run Analysis
            </button>
            <button
              v-if="store.activeScan.status === 'scanning'"
              type="button"
              @click.stop="cancelTelemetry"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <Square class="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 px-6 gap-3">
        <UploadCloud class="w-6 h-6 text-surface-400" />
        <p class="text-sm font-semibold text-surface-700 dark:text-surface-300">Drop MRI image or DICOM here</p>
        <p class="text-xs text-surface-400 text-center">JPEG · PNG · TIFF · BMP · DICOM · max 10 MB</p>
      </div>

      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :multiple="isSeries"
        accept=".jpg,.jpeg,.png,.tiff,.tif,.bmp,.dcm,.dicom,image/*"
        @change="(e) => handleFileChange(e, isSeries)"
      />
    </div>

    <p v-if="uploadWarning" class="text-xs text-warning-600 bg-warning-50 border border-warning-100 rounded-lg px-3 py-2">
      {{ uploadWarning }}
    </p>

    <div
      v-if="uploadError || store.activeScan.error"
      class="flex items-start gap-3 p-3.5 rounded-lg bg-danger-50 border border-danger-100"
      role="alert"
    >
      <AlertCircle class="w-4 h-4 text-danger-500 shrink-0 mt-0.5" />
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-danger-700">{{ uploadError || store.activeScan.error }}</p>
        <button
          v-if="store.activeScan.status === 'error'"
          type="button"
          @click="submitScan"
          class="mt-1.5 text-xs font-semibold text-danger-600 underline focus:outline-none"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { UploadCloud, X, Play, Square, AlertCircle } from 'lucide-vue-next';
import { useUpload } from '../../composables/useUpload';
import { usePredictionStore } from '../../stores/predictionStore';
import { predictionService } from '../../services/predictionService';
import { aggregateBatchPredictions } from '../../utils/scanRecord';

const store = usePredictionStore();
const {
  isDragging, uploadError, uploadWarning, selectedFile, selectedFiles, previewUrl, imageMeta, processing,
  handleDragOver, handleDragLeave, handleDrop, handleFileChange, clearSelection,
} = useUpload();

const isSeries = computed(() => store.uploadMode === 'series');
const slowRequest = ref(false);
const progressLabel = ref('Analyzing…');
let slowTimer = null;

const canReset = computed(() =>
  ['idle', 'error', 'success'].includes(store.activeScan.status)
);

function modeBtn(mode) {
  const on = store.uploadMode === mode;
  return [
    'px-3 py-1.5 text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500',
    on ? 'bg-white dark:bg-surface-800 text-brand-700 shadow-sm' : 'text-surface-500',
  ];
}

const triggerReset = () => {
  clearSelection();
  store.resetActiveScan();
};

const cancelTelemetry = () => {
  predictionService.cancelPredict();
  store.resetActiveScan();
  slowRequest.value = false;
  clearTimeout(slowTimer);
};

const submitScan = async () => {
  if (isSeries.value) {
    if (!selectedFiles.value.length) return;
    await runSeries();
    return;
  }
  if (!selectedFile.value) return;
  await runSingle(selectedFile.value, previewUrl.value, imageMeta.value);
};

async function runSingle(file, preview, meta) {
  store.updateActiveScan({ status: 'scanning', error: null, progress: 0, result: null });
  store.clearBatchSummary();
  slowRequest.value = false;
  slowTimer = setTimeout(() => { slowRequest.value = true; }, 8000);
  progressLabel.value = 'Analyzing…';

  try {
    const res = await predictionService.predict(file);
    clearTimeout(slowTimer);
    slowRequest.value = false;
    if (res) {
      const record = store.addHistoryItem({
        fileName: file.name,
        fileSize: file.size,
        previewUrl: preview,
        prediction: res.prediction,
        confidence: res.confidence,
        isMocked: res.isMocked || false,
        heatmap: res.heatmap || null,
        imageWidth: meta?.width,
        imageHeight: meta?.height,
      });
      store.updateActiveScan({ status: 'success', progress: 100, result: record });
    }
  } catch (err) {
    clearTimeout(slowTimer);
    store.updateActiveScan({
      status: 'error',
      error: err?.message || 'Could not connect to the analysis server.',
    });
  }
}

async function runSeries() {
  const batchId = `batch-${Date.now()}`;
  const results = [];
  store.updateActiveScan({ status: 'scanning', error: null, progress: 0, result: null });
  store.clearBatchSummary();

  for (let i = 0; i < selectedFiles.value.length; i++) {
    const item = selectedFiles.value[i];
    progressLabel.value = `Slice ${i + 1} of ${selectedFiles.value.length}…`;
    store.updateActiveScan({ progress: Math.round(((i + 0.5) / selectedFiles.value.length) * 100) });

    try {
      const res = await predictionService.predict(item.file);
      if (res) {
        results.push(res);
        const record = store.addHistoryItem({
          fileName: item.file.name,
          fileSize: item.file.size,
          previewUrl: item.previewUrl,
          prediction: res.prediction,
          confidence: res.confidence,
          isMocked: res.isMocked || false,
          heatmap: res.heatmap || null,
          batchId,
          sliceIndex: i + 1,
          imageWidth: item.width,
          imageHeight: item.height,
        });
        if (i === selectedFiles.value.length - 1) {
          store.updateActiveScan({ status: 'success', progress: 100, result: record });
        }
      }
    } catch (err) {
      store.updateActiveScan({
        status: 'error',
        error: err?.message || `Failed on slice ${i + 1}.`,
      });
      return;
    }
  }

  if (results.length) {
    store.setBatchSummary(aggregateBatchPredictions(results));
  }
}
</script>
