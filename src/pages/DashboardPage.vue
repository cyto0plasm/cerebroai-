<template>
  <div class="min-h-screen">
    <WorkspacePanel gate />
    <OnboardingTour />

    <div class="border-b border-surface-200/80 dark:border-surface-800 bg-surface-0/80 dark:bg-surface-900/80 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <h1 class="font-display text-base font-bold text-surface-900 dark:text-surface-50 leading-tight">
            Workspace
          </h1>
          <p class="text-[11px] text-surface-500 truncate">
            {{ store.canPersist ? 'Cloud' : 'Session' }}
            · {{ store.history.length }} {{ store.history.length === 1 ? 'study' : 'studies' }}
          </p>
        </div>
        <WorkspacePanel inline />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <p
        v-if="store.workspaceError"
        class="mb-4 text-xs text-danger-700 dark:text-danger-300 bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-800 rounded-lg px-4 py-3"
        role="alert"
      >
        {{ store.workspaceError }}
      </p>
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
          <section data-tour="history" class="panel sticky top-[4.5rem]">
            <div class="panel-header flex items-center justify-between">
              <span class="text-sm font-semibold">Study list</span>
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

const store = usePredictionStore();
</script>
