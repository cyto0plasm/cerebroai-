<template>
  <div class="min-h-screen">
    <WorkspacePanel gate />
    <OnboardingTour />

    <div class="border-b border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 px-4 sm:px-6 lg:px-8 py-5">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-display text-xl font-bold text-surface-900 dark:text-surface-50">Screening workspace</h1>
          <p class="text-xs text-surface-500 mt-1">Upload · screen · review maps and report</p>
        </div>
        <div class="flex flex-col items-start sm:items-end gap-2">
          <WorkspacePanel />
          <ModelBadge />
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-8 flex flex-col gap-5">
          <DashboardGuidelines v-if="store.history.length === 0 && !store.syncing" />

          <section class="panel">
            <div class="panel-header flex items-center justify-between">
              <span class="text-sm font-semibold">Upload slice</span>
              <span class="text-xs text-surface-400">DICOM · JPEG · PNG · max 10 MB</span>
            </div>
            <div class="p-5">
              <UploadZone />
            </div>
          </section>

          <InterpretationGuide v-if="store.currentInspectedScan" />
          <PredictionResult :scan="store.currentInspectedScan" />
        </div>

        <div class="lg:col-span-4 flex flex-col gap-5">
          <section data-tour="history" class="panel sticky top-24">
            <div class="panel-header flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold">Study list</span>
                <p class="text-[10px] text-surface-400">{{ store.canPersist ? 'Cloud workspace' : 'This session only' }}</p>
              </div>
              <span class="chip bg-surface-100 dark:bg-surface-800 text-surface-600">{{ store.history.length }}</span>
            </div>
            <div class="p-4">
              <div v-if="store.syncing" class="text-xs text-surface-400 py-8 text-center">Loading workspace…</div>
              <PredictionHistory v-else />
            </div>
          </section>

          <HistoryCompare v-if="store.canPersist && store.history.length >= 2" />
          <SessionTools v-if="store.canPersist" />
          <GuestLimits v-else />
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
import GuestLimits from '../components/auth/GuestLimits.vue';
import WorkspacePanel from '../components/auth/WorkspacePanel.vue';
import OnboardingTour from '../components/onboarding/OnboardingTour.vue';
import ModelBadge from '../components/layout/ModelBadge.vue';

const store = usePredictionStore();
</script>
