<template>
  <div>
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <TimelineSection />

    <!-- CTA -->
    <section class="bg-gradient-to-r from-brand-600 to-brand-700">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center gap-5">
        <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {{ t('hero.cta') }}
        </h2>
        <p class="text-brand-100 text-base max-w-md leading-relaxed">
          No account required. Upload an MRI slice, run the analysis, and review your result and heatmap in the dashboard.
        </p>
        <router-link to="/dashboard">
          <button class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 text-base font-bold rounded-xl hover:bg-brand-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            {{ t('hero.cta') }}
            <ArrowRight class="w-5 h-5" />
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n';
import { ArrowRight } from 'lucide-vue-next';
import HeroSection from '../components/landing/HeroSection.vue';
import StatsSection from '../components/landing/StatsSection.vue';
import FeaturesSection from '../components/landing/FeaturesSection.vue';
import TimelineSection from '../components/landing/TimelineSection.vue';

const { t } = useI18n();
</script>
