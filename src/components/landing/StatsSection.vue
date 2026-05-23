<template>
  <section class="bg-brand-950 border-y border-brand-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(stat, idx) in CAPABILITIES" :key="idx" class="flex flex-col gap-1">
          <span class="text-2xl font-display font-bold text-brand-100 tracking-tight">{{ stat.metric }}</span>
          <span class="text-sm font-medium text-brand-200/90">{{ stat.label }}</span>
          <span class="text-xs text-brand-300/70">{{ stat.subText }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { CAPABILITIES } from '../../constants';
</script>
