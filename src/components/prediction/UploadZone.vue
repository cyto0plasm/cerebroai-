<template>
  <div class="flex flex-col gap-4">

    <!-- Drop zone / preview -->
    <div
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="[
        'relative border-2 border-dashed rounded-xl transition-colors duration-150 select-none',
        isDragging
          ? 'border-brand-400 bg-brand-50'
          : uploadError
            ? 'border-danger-300 bg-danger-50'
            : previewUrl
              ? 'border-surface-200 bg-white p-0 overflow-hidden'
              : 'border-surface-200 bg-surface-50 hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer'
      ]"
      @click="!previewUrl ? $refs.fileInput.click() : null"
    >
      <!-- Preview -->
      <div v-if="previewUrl" class="flex flex-col sm:flex-row">
        <!-- Image -->
        <div class="relative sm:w-48 h-48 shrink-0 bg-surface-900 overflow-hidden">
          <img :src="previewUrl" alt="MRI preview" class="w-full h-full object-cover" />
          <!-- Scanning overlay -->
          <div
            v-if="store.activeScan.status === 'scanning'"
            class="absolute inset-0 bg-surface-900/70 flex flex-col items-center justify-center gap-2"
          >
            <svg class="animate-spin w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span class="text-xs text-white font-medium">Analyzing...</span>
            <span v-if="slowRequest" class="text-[10px] text-surface-300 text-center px-2">Server waking up,<br/>please wait...</span>
          </div>
          <!-- Success overlay -->
          <div
            v-if="store.activeScan.status === 'success'"
            class="absolute top-2 right-2"
          >
            <div class="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- File info + actions -->
        <div class="flex flex-col justify-between p-4 flex-1 min-w-0">
          <div class="flex flex-col gap-1">
            <p class="text-sm font-semibold text-surface-900 truncate">{{ selectedFile?.name }}</p>
            <p class="text-xs text-surface-400">{{ (selectedFile?.size / 1024).toFixed(0) }} KB · {{ selectedFile?.type?.split('/')[1]?.toUpperCase() }}</p>
          </div>

          <div class="flex items-center gap-2 mt-4">
            <button
              v-if="store.activeScan.status === 'idle' || store.activeScan.status === 'error' || store.activeScan.status === 'success'"
              @click.stop="triggerReset"
              class="text-xs text-surface-400 hover:text-surface-700 transition-colors flex items-center gap-1 focus:outline-none"
            >
              <X class="w-3.5 h-3.5" />
              Remove
            </button>

            <button
              v-if="store.activeScan.status === 'idle'"
              @click.stop="submitScan"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <Play class="w-3.5 h-3.5" />
              Run Analysis
            </button>

            <button
              v-if="store.activeScan.status === 'scanning'"
              @click.stop="cancelTelemetry"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-100 text-surface-600 text-xs font-semibold rounded-lg hover:bg-surface-200 transition-colors focus:outline-none"
            >
              <Square class="w-3.5 h-3.5" />
              Cancel
            </button>

            <button
              v-if="store.activeScan.status === 'success'"
              @click.stop="triggerReset"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors focus:outline-none"
            >
              <Upload class="w-3.5 h-3.5" />
              New Scan
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center justify-center py-12 px-6 gap-3">
        <div class="w-12 h-12 rounded-xl bg-white border border-surface-200 shadow-card flex items-center justify-center">
          <UploadCloud class="w-6 h-6 text-surface-400" />
        </div>
        <div class="text-center">
          <p class="text-sm font-semibold text-surface-700">Drop your MRI image here</p>
          <p class="text-xs text-surface-400 mt-1">or click anywhere to browse</p>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/jpeg,image/png,image/tiff,image/bmp"
        @change="handleFileChange"
      />
    </div>

    <!-- Error -->
    <div
      v-if="uploadError || store.activeScan.error"
      class="flex items-start gap-3 p-3.5 rounded-lg bg-danger-50 border border-danger-100 animate-fade-in"
    >
      <AlertCircle class="w-4 h-4 text-danger-500 shrink-0 mt-0.5" />
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-danger-700">{{ uploadError || store.activeScan.error }}</p>
        <button
          v-if="store.activeScan.status === 'error'"
          @click="submitScan"
          class="mt-1.5 text-xs font-semibold text-danger-600 hover:text-danger-700 underline underline-offset-2 focus:outline-none"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadCloud, X, Play, Square, AlertCircle, Upload } from 'lucide-vue-next';
import { useUpload } from '../../composables/useUpload';
import { usePredictionStore } from '../../stores/predictionStore';
import { predictionService } from '../../services/predictionService';

const store = usePredictionStore();
const { isDragging, uploadError, selectedFile, previewUrl, handleDragOver, handleDragLeave, handleDrop, handleFileChange, clearSelection } = useUpload();

// Show "waking up" message if request takes more than 8 seconds
const slowRequest = ref(false);
let slowTimer = null;

const triggerReset = () => { clearSelection(); store.resetActiveScan(); };
const cancelTelemetry = () => { predictionService.cancelPredict(); store.resetActiveScan(); slowRequest.value = false; clearTimeout(slowTimer); };

const submitScan = async () => {
  if (!selectedFile.value) return;
  store.updateActiveScan({ status: 'scanning', error: null, progress: 10, result: null });
  slowRequest.value = false;
  slowTimer = setTimeout(() => { slowRequest.value = true; }, 8000);
  try {
    const res = await predictionService.predict(selectedFile.value);
    if (res) {
      clearTimeout(slowTimer); slowRequest.value = false;
      store.updateActiveScan({ status: 'success', progress: 100, result: {
        ...res,
        id: `active-${Date.now()}`,
        fileName: selectedFile.value.name,
        fileSize: selectedFile.value.size,
        heatmap: res.heatmap || null
      } });
      store.addHistoryItem({
        fileName: selectedFile.value.name,
        fileSize: selectedFile.value.size,
        previewUrl: previewUrl.value,
        prediction: res.prediction,
        confidence: res.confidence,
        isMocked: res.isMocked || false,
        heatmap: res.heatmap || null
      });
    }
  } catch (err) {
    clearTimeout(slowTimer); slowRequest.value = false;
    store.updateActiveScan({ status: 'error', error: err?.message || 'Could not connect to the analysis server.' });
  }
};
</script>
