<template>
  <div
    class="flex items-center gap-2 text-xs"
    :title="tooltip"
    role="status"
    :aria-live="app.backend.checking ? 'polite' : 'off'"
  >
    <span
      class="w-2 h-2 rounded-full shrink-0"
      :class="statusDotClass"
      :aria-hidden="true"
    />
    <span :class="statusTextClass" class="font-medium hidden lg:inline">
      {{ statusLabel }}
    </span>
    <span
      v-if="app.backend.modelLoaded && app.backend.threshold != null"
      class="hidden xl:inline text-surface-400 font-mono"
    >
      {{ app.backend.architecture }} · τ={{ app.backend.threshold }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../../stores/appStore';
import { CONFIG } from '../../config';

const app = useAppStore();

const statusLabel = computed(() => {
  if (app.backend.checking) return 'Checking…';
  if (!app.backend.online) return 'Server offline';
  if (!app.backend.modelLoaded) return 'Model loading';
  return 'Model ready';
});

const statusDotClass = computed(() => {
  if (app.backend.checking) return 'bg-surface-400 animate-pulse';
  if (!app.backend.online) return 'bg-danger-500';
  if (!app.backend.modelLoaded) return 'bg-warning-500 animate-pulse';
  return 'bg-success-500';
});

const statusTextClass = computed(() => {
  if (!app.backend.online) return 'text-danger-600';
  if (!app.backend.modelLoaded) return 'text-warning-600';
  return 'text-success-600';
});

const tooltip = computed(() => {
  const arch = app.backend.architecture || CONFIG.MODEL_DISPLAY.architecture;
  if (!app.backend.online) return `Cannot reach API. ${app.backend.loadError || ''}`;
  if (!app.backend.modelLoaded) return `API online; model not loaded. ${app.backend.loadError || ''}`;
  return `${arch} ready · threshold ${app.backend.threshold}`;
});
</script>
