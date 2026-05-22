<template>
  <section class="bg-surface-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(stat, idx) in BENCHMARKS" :key="idx" class="flex flex-col gap-1">
          <span class="text-2xl font-bold text-white tracking-tight">{{ stat.metric }}</span>
          <span class="text-sm font-medium text-surface-300">{{ stat.label }}</span>
          <span class="text-xs text-surface-500">{{ stat.subText }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { BENCHMARKS } from '../../constants';
</script>
