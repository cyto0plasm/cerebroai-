<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <OnboardingTour />

    <div class="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-4 sm:px-6 lg:px-8 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-base font-bold text-surface-900 dark:text-surface-100">MRI screening workspace</h1>
          <p class="text-xs text-surface-400 mt-0.5">Upload · analyze · review plots and report</p>
        </div>
        <ModelBadge />
        <div v-if="store.stats.total > 0" class="flex items-center gap-3 text-xs text-surface-500">
          <span><span class="font-bold text-surface-900 dark:text-surface-100">{{ store.stats.total }}</span> in session</span>
          <span><span class="font-bold text-danger-500">{{ store.stats.tumors }}</span> flagged</span>
          <span><span class="font-bold text-success-600">{{ store.stats.clearScans }}</span> clear</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-8 flex flex-col gap-5">
          <DashboardGuidelines v-if="store.history.length === 0" />

          <div class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden">
            <div class="px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
              <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">Upload MRI image</span>
              <span class="text-xs text-surface-400">+ DICOM · max 10 MB</span>
            </div>
            <div class="p-5">
              <UploadZone />
            </div>
          </div>

          <InterpretationGuide v-if="store.currentInspectedScan" />
          <PredictionResult :scan="store.currentInspectedScan" />
        </div>

        <div class="lg:col-span-4 flex flex-col gap-5">
          <div
            data-tour="history"
            class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-card sticky top-20"
          >
            <div class="px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold text-surface-900 dark:text-surface-100">Your scans</span>
                <p class="text-[10px] text-surface-400">This browser only</p>
              </div>
              <span class="text-xs font-semibold bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded-full">
                {{ store.history.length }}
              </span>
            </div>
            <div class="p-4">
              <PredictionHistory />
            </div>
            <div v-if="store.history.length > 0" class="px-4 pb-4 border-t border-surface-100 dark:border-surface-700">
              <button
                type="button"
                @click="store.clearAllHistory"
                class="text-xs text-surface-400 hover:text-danger-500 w-full text-left focus:outline-none focus:ring-2 focus:ring-danger-500 rounded"
              >
                Clear all scans
              </button>
            </div>
          </div>

          <HistoryCompare />
          <SessionTools />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePredictionStore } from '../stores/predictionStore';
import UploadZone from '../components/prediction/UploadZone.vue';
import PredictionResult from '../components/prediction/PredictionResult.vue';
import PredictionHistory from '../components/prediction/PredictionHistory.vue';
import DashboardGuidelines from '../components/prediction/DashboardGuidelines.vue';
import InterpretationGuide from '../components/prediction/InterpretationGuide.vue';
import HistoryCompare from '../components/prediction/HistoryCompare.vue';
import SessionTools from '../components/prediction/SessionTools.vue';
import OnboardingTour from '../components/onboarding/OnboardingTour.vue';
import ModelBadge from '../components/layout/ModelBadge.vue';

const store = usePredictionStore();
</script>
