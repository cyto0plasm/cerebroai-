<template>
  <div class="panel rounded-xl">
    <div class="px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex items-start gap-3">
      <div class="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950 flex items-center justify-center shrink-0">
        <BookOpen class="w-4 h-4 text-brand-600 dark:text-brand-400" />
      </div>
      <div>
        <h2 class="text-sm font-semibold text-surface-900 dark:text-surface-100">Before you analyze</h2>
        <p class="text-xs text-surface-500 dark:text-surface-400 mt-0.5 leading-relaxed">
          Quick guide for clinicians and researchers using this screening tool.
        </p>
      </div>
    </div>

    <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="step in steps"
        :key="step.title"
        class="flex gap-3 p-3.5 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700"
      >
        <span class="w-6 h-6 rounded-full bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-600 flex items-center justify-center text-[11px] font-bold text-brand-700 dark:text-brand-300 shrink-0">
          {{ step.num }}
        </span>
        <div>
          <p class="text-xs font-semibold text-surface-800 dark:text-surface-200">{{ step.title }}</p>
          <p class="text-[11px] text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">{{ step.body }}</p>
        </div>
      </div>
    </div>

    <div class="px-5 pb-5 flex flex-col gap-2">
      <div class="rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
        <strong>Important:</strong> Results are screening aids only. Confirm with standard radiology workflow and clinical judgment.
      </div>
      <p class="text-[11px] text-surface-400">
        Scan history is stored only in this browser. Images are sent to the analysis server for inference; they are not stored in a shared database.
      </p>
    </div>
  </div>
</template>

<script setup>
import { BookOpen } from 'lucide-vue-next';

const steps = [
  {
    num: 1,
    title: 'Upload one axial slice',
    body: 'Use a single 2D brain MRI slice (JPEG, PNG, TIFF, or BMP, max 10 MB). Avoid photos of screens or non-MRI images.',
  },
  {
    num: 2,
    title: 'Run analysis',
    body: 'The model returns Tumor / No tumor, a confidence score, and a Grad-CAM heatmap. First request after idle may take ~30 seconds.',
  },
  {
    num: 3,
    title: 'Review plots & report',
    body: 'Expand Visual analysis for original scan, activation map, side-by-side view, and class probabilities.',
  },
  {
    num: 4,
    title: 'Interpret with care',
    body: 'High confidence does not equal diagnosis. Use heatmaps to see where the model looked — not as definitive lesion borders.',
  },
];
</script>
