<template>
  <div class="min-h-screen bg-surface-50">

    <!-- Top bar -->
    <div class="bg-white border-b border-surface-200 px-4 sm:px-6 lg:px-8 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-base font-bold text-surface-900">MRI Analysis</h1>
          <p class="text-xs text-surface-400 mt-0.5">Upload a scan · get an instant AI result</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-4 text-xs text-surface-500 border-r border-surface-200 pr-4">
            <span><span class="font-bold text-surface-900">{{ store.stats.total }}</span> scans</span>
            <span><span class="font-bold text-danger-500">{{ store.stats.tumors }}</span> positive</span>
            <span><span class="font-bold text-success-600">{{ store.stats.clearScans }}</span> clear</span>
          </div>
          <div v-if="store.stats.avgConfidence > 0" class="text-xs text-surface-500">
            Avg confidence <span class="font-bold text-surface-900">{{ store.stats.avgConfidence }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- LEFT COLUMN: Upload + Result -->
        <div class="lg:col-span-8 flex flex-col gap-5">

          <!-- Upload + preview in one card -->
          <div class="bg-white rounded-xl border border-surface-200 shadow-card overflow-hidden">
            <div class="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-md bg-brand-50 flex items-center justify-center">
                  <Upload class="w-3.5 h-3.5 text-brand-600" />
                </div>
                <span class="text-sm font-semibold text-surface-900">Upload Scan</span>
              </div>
              <span class="text-xs text-surface-400">JPEG · PNG · TIFF · BMP · max 10 MB</span>
            </div>
            <div class="p-5">
              <UploadZone />
            </div>
          </div>

          <!-- Result -->
          <PredictionResult :scan="store.currentInspectedScan" />
        </div>

        <!-- RIGHT COLUMN: History -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-xl border border-surface-200 shadow-card sticky top-20">
            <div class="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-md bg-surface-100 flex items-center justify-center">
                  <ClipboardList class="w-3.5 h-3.5 text-surface-500" />
                </div>
                <span class="text-sm font-semibold text-surface-900">History</span>
                <span class="text-xs font-semibold bg-surface-100 text-surface-500 px-2 py-0.5 rounded-full">
                  {{ store.history.length }}
                </span>
              </div>
              <button
                v-if="store.history.length > 0"
                @click="store.clearAllHistory"
                class="text-xs text-surface-400 hover:text-danger-500 transition-colors focus:outline-none"
              >
                Clear all
              </button>
            </div>
            <div class="p-4">
              <PredictionHistory />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { Upload, ClipboardList } from 'lucide-vue-next';
import { usePredictionStore } from '../stores/predictionStore';
import UploadZone from '../components/prediction/UploadZone.vue';
import PredictionResult from '../components/prediction/PredictionResult.vue';
import PredictionHistory from '../components/prediction/PredictionHistory.vue';

const store = usePredictionStore();
</script>
