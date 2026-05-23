<template>
  <div
    v-if="store.history.length >= 2"
    class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-card overflow-hidden"
  >
    <div class="px-5 py-4 border-b border-surface-100 dark:border-surface-700">
      <h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">Compare scans</h3>
      <p class="text-xs text-surface-500 mt-0.5">Select two results from this session</p>
    </div>

    <div class="p-4 flex flex-col gap-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="text-xs font-medium text-surface-600 dark:text-surface-400">
          Scan A
          <select
            v-model="compareA"
            class="mt-1 w-full text-xs border border-surface-200 dark:border-surface-600 rounded-lg px-2 py-2 bg-white dark:bg-surface-900"
          >
            <option :value="null">—</option>
            <option v-for="h in store.history" :key="h.id" :value="h.id">{{ h.fileName }}</option>
          </select>
        </label>
        <label class="text-xs font-medium text-surface-600 dark:text-surface-400">
          Scan B
          <select
            v-model="compareB"
            class="mt-1 w-full text-xs border border-surface-200 dark:border-surface-600 rounded-lg px-2 py-2 bg-white dark:bg-surface-900"
          >
            <option :value="null">—</option>
            <option v-for="h in store.history" :key="h.id" :value="h.id">{{ h.fileName }}</option>
          </select>
        </label>
      </div>

      <div v-if="scanA && scanB" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompareCard label="A" :scan="scanA" />
        <CompareCard label="B" :scan="scanB" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePredictionStore } from '../../stores/predictionStore';
import { useAppStore } from '../../stores/appStore';
import CompareCard from './CompareCard.vue';

const store = usePredictionStore();
const app = useAppStore();

const compareA = computed({
  get: () => app.compareA,
  set: (v) => app.setCompareSelection('a', v),
});
const compareB = computed({
  get: () => app.compareB,
  set: (v) => app.setCompareSelection('b', v),
});

const scanA = computed(() => store.history.find(h => h.id === app.compareA));
const scanB = computed(() => store.history.find(h => h.id === app.compareB));
</script>
