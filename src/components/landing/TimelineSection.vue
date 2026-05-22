<template>
  <section id="how-it-works" class="bg-surface-50 border-b border-surface-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      <div class="text-center mb-14">
        <p class="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">How it works</p>
        <h2 class="text-3xl font-bold text-surface-900 tracking-tight">From upload to result in 4 steps</h2>
      </div>

      <div class="relative">
        <!-- Connecting line -->
        <div class="hidden lg:block absolute top-5 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px bg-surface-200"></div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(step, idx) in WORKFLOW_STEPS" :key="idx" class="flex flex-col gap-4">
            <!-- Number -->
            <div class="flex items-center gap-3 lg:flex-col lg:items-start">
              <div class="w-10 h-10 rounded-full bg-white border-2 border-brand-600 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0 relative z-10">
                {{ idx + 1 }}
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-surface-900 mb-1">{{ step.title }}</p>
              <p class="text-xs text-surface-500 leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { WORKFLOW_STEPS } from '../../constants';
</script>
