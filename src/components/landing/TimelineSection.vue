<template>
  <section id="how-it-works" class="bg-surface-50 dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-14">
        <p class="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">Workflow</p>
        <h2 class="font-display text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight">
          Four steps from slice to report
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(step, idx) in WORKFLOW_STEPS"
          :key="idx"
          class="panel p-5 flex flex-col gap-3"
        >
          <span class="w-9 h-9 rounded-full border-2 border-brand-500 text-brand-600 dark:text-brand-300 flex items-center justify-center text-sm font-bold">
            {{ idx + 1 }}
          </span>
          <p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{{ step.title }}</p>
          <p class="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { WORKFLOW_STEPS } from '../../constants';
</script>
