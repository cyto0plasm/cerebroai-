<template>
  <section class="relative overflow-hidden border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent dark:from-brand-950/50" />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
      <div class="flex justify-center mb-8">
        <AppLogo :link="false" size="lg" show-tagline />
      </div>

      <p class="chip bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 mx-auto mb-6">
        Brain MRI screening · Grad-CAM review
      </p>

      <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-surface-50 tracking-tight leading-[1.1] max-w-3xl mx-auto">
        Advanced brain MRI screening
      </h1>

      <p class="mt-5 text-base sm:text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
        Upload a slice, receive a structured screening result, and inspect activation maps.
        Members keep a private workspace; guests work in a temporary session.
      </p>

      <ul class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left text-sm text-surface-600 dark:text-surface-400">
        <li v-for="point in trustPoints" :key="point" class="flex items-start gap-2">
          <Check class="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          {{ point }}
        </li>
      </ul>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <router-link to="/dashboard">
          <BaseButton variant="primary" size="lg">Open workspace</BaseButton>
        </router-link>
        <a href="#how-it-works">
          <BaseButton variant="secondary" size="lg">How it works</BaseButton>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Check } from 'lucide-vue-next';
import AppLogo from '../ui/AppLogo.vue';
import BaseButton from '../ui/BaseButton.vue';

const trustPoints = [
  'Single-slice ResNet18 screening with confidence',
  'Original, activation map, and comparison views',
  'Signed-in private archive with rename & export',
  'Guest mode — no cloud persistence',
];
</script>
