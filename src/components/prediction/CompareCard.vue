<template>
  <div class="rounded-lg border border-surface-200 dark:border-surface-600 p-3 flex flex-col gap-2">
    <p class="text-[11px] font-bold text-surface-400 uppercase">Scan {{ label }}</p>
    <p class="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{{ scan.fileName }}</p>
    <p
      class="text-sm font-bold"
      :class="scan.prediction === 'Tumor' ? 'text-danger-600' : 'text-success-600'"
    >
      {{ scan.prediction }} · {{ Math.round(scan.confidence * 100) }}%
    </p>
    <div class="grid grid-cols-2 gap-2">
      <img
        v-if="scan.previewUrl"
        :src="scan.previewUrl"
        alt=""
        class="rounded border border-surface-200 object-cover aspect-square w-full"
      />
      <img
        v-if="scan.heatmap"
        :src="scan.heatmap"
        alt=""
        class="rounded border border-surface-200 object-cover aspect-square w-full"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  scan: { type: Object, required: true },
});
</script>
