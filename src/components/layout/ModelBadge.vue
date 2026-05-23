<template>
  <div
    v-if="app.backend.online !== null"
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-900 text-[11px]"
    :title="tooltip"
  >
    <Cpu class="w-3.5 h-3.5 text-surface-500 shrink-0" />
    <span class="font-mono text-surface-600 dark:text-surface-400">
      {{ arch }} · {{ inputSize }}
      <template v-if="app.backend.threshold != null"> · τ={{ app.backend.threshold }}</template>
    </span>
    <span
      class="font-semibold"
      :class="app.backend.modelLoaded ? 'text-success-600' : 'text-warning-600'"
    >
      {{ app.backend.modelLoaded ? 'loaded' : 'pending' }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Cpu } from 'lucide-vue-next';
import { useAppStore } from '../../stores/appStore';
import { CONFIG } from '../../config';

const app = useAppStore();
const arch = computed(() => app.backend.architecture || CONFIG.MODEL_DISPLAY.architecture);
const inputSize = CONFIG.MODEL_DISPLAY.inputSize;
const tooltip = computed(() =>
  app.backend.modelRepo ? `Weights: ${app.backend.modelRepo}` : 'Model repository from server'
);
</script>
