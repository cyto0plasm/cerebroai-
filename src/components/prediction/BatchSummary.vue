<template>
  <div
    v-if="summary"
    class="rounded-xl border border-brand-200 bg-brand-50 dark:bg-brand-950/30 dark:border-brand-800 p-5 flex flex-col gap-3"
  >
    <h3 class="text-sm font-semibold text-brand-900 dark:text-brand-100">Multi-slice aggregate</h3>
    <p class="text-xs text-brand-700 dark:text-brand-300">
      {{ summary.total }} slices analyzed · {{ summary.tumorVotes }} flagged tumor
    </p>
    <p class="text-lg font-bold text-surface-900 dark:text-surface-100">
      Consensus: {{ summary.prediction }}
      <span class="text-base font-semibold text-surface-600">({{ Math.round(summary.confidence * 100) }}% avg confidence)</span>
    </p>
    <p class="text-[11px] text-surface-500">Majority vote across uploaded slices — review individual results in history.</p>
  </div>
</template>

<script setup>
defineProps({
  summary: { type: Object, default: null },
});
</script>
