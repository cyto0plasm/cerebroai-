<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-surface-50 via-blue-50/30 to-surface-50 border-b border-surface-200">
    <!-- Animated gradient orbs -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/20 blur-3xl animate-float-slow"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-100/20 blur-3xl animate-float-delayed"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-brand-200/10 to-transparent blur-3xl"
    />

    <!-- Subtle grid -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-[0.02]"
      style="background-image: radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0); background-size: 40px 40px;"
    />

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24 lg:pb-32">
      <!-- Centered content -->
      <div class="flex flex-col items-center text-center">
        <!-- Logo -->
        <div class="mb-8 animate-fade-in-up">
          <AppLogo :link="false" size="lg" show-tagline />
        </div>

        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-surface-200/50 text-surface-600 text-xs font-semibold mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up-delay-1">
          <ScanLine class="w-4 h-4 text-brand-600" />
          <span>{{ t('hero.features') }}</span>
        </div>

        <!-- Main heading with gradient -->
        <div class="mb-6 animate-fade-in-up-delay-2">
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-surface-900 via-brand-700 to-surface-900 leading-tight tracking-tight mb-4">
            {{ t('hero.title') }}
          </h1>
          <p class="text-xl sm:text-2xl font-semibold text-brand-600">
            {{ t('hero.subtitle') }}
          </p>
        </div>

        <!-- Description -->
        <p class="text-lg sm:text-xl text-surface-600 leading-relaxed max-w-3xl mb-10 animate-fade-in-up-delay-3">
          {{ t('hero.description') }}
        </p>

        <!-- Trust points grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 w-full max-w-2xl animate-fade-in-up-delay-4">
          <div
            v-for="point in t_trustPoints"
            :key="point"
            class="flex items-start gap-3 p-4 rounded-lg bg-white/70 backdrop-blur border border-surface-100/50 hover:border-brand-200/50 hover:bg-white/90 transition-all duration-300"
          >
            <Check class="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <span class="text-sm text-surface-700 font-medium">{{ point }}</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up-delay-5">
          <router-link to="/dashboard">
            <button class="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-base font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:from-brand-700 hover:to-brand-800 transform hover:-translate-y-1 active:translate-y-0">
              {{ t('hero.cta') }}
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </router-link>
          <a href="#how-it-works">
            <button class="inline-flex items-center gap-2 px-8 py-4 bg-white text-surface-900 text-base font-semibold rounded-xl border border-surface-200/50 hover:border-brand-300 hover:bg-surface-50 transition-all duration-300 shadow-md hover:shadow-lg">
              {{ t('hero.secondary') }}
            </button>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from '../../composables/useI18n';
import { computed } from 'vue';
import { ArrowRight, Check, ScanLine } from 'lucide-vue-next';
import AppLogo from '../ui/AppLogo.vue';

const { t } = useI18n();

const t_trustPoints = computed(() => [
  t('hero.trustPoints.0'),
  t('hero.trustPoints.1'),
  t('hero.trustPoints.2'),
  t('hero.trustPoints.3'),
]);
</script>
