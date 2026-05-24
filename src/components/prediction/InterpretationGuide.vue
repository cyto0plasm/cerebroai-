<template>
  <div class="panel rounded-xl">
    <button
      type="button"
      :aria-expanded="open"
      @click="open = !open"
      class="w-full px-4 py-3 flex items-center justify-between gap-3 text-left rounded-t-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div class="flex items-center gap-2">
        <Stethoscope class="w-4 h-4 text-surface-500 dark:text-surface-400" />
        <span class="text-xs font-semibold text-surface-800 dark:text-surface-200">How to interpret results</span>
      </div>
      <ChevronDown class="w-4 h-4 text-surface-400 transition-transform" :class="{ 'rotate-180': open }" />
    </button>

    <div v-show="open" class="px-4 pb-4 border-t border-surface-100 dark:border-surface-700 rounded-b-xl">
      <ul class="flex flex-col gap-2.5 pt-3 text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
        <li v-for="tip in tips" :key="tip" class="flex gap-2">
          <span class="text-brand-600 dark:text-brand-400 font-bold shrink-0">·</span>
          <span>{{ tip }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Stethoscope, ChevronDown } from 'lucide-vue-next';

const open = ref(false);

const tips = [
  'Tumor / No tumor is a binary screening output from a 2D slice — not a full neuroradiology report.',
  'Confidence reflects model certainty for the chosen class, not clinical probability of disease.',
  'Grad-CAM highlights regions that influenced the decision; it is not a segmentation mask.',
  'Low-confidence or borderline cases warrant human review regardless of the label shown.',
  'Do not use this tool as the sole basis for treatment, referral, or patient communication.',
];
</script>
