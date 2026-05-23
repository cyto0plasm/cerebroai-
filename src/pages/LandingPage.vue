<template>
  <div>
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <TimelineSection />

    <!-- CTA -->
    <section class="bg-brand-600">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center gap-5">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ready to analyze a scan?
        </h2>
        <p class="text-brand-200 text-sm max-w-md leading-relaxed">
          No account required. Upload an MRI slice, run the analysis, and review your result and heatmap in the dashboard.
        </p>
        <router-link to="/dashboard">
          <button class="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 text-sm font-bold rounded-lg hover:bg-brand-50 transition-colors">
            Analyze a scan
            <ArrowRight class="w-4 h-4" />
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next';
import HeroSection from '../components/landing/HeroSection.vue';
import StatsSection from '../components/landing/StatsSection.vue';
import FeaturesSection from '../components/landing/FeaturesSection.vue';
import TimelineSection from '../components/landing/TimelineSection.vue';
</script>
