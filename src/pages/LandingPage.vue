<template>
  <div>
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <TimelineSection />

    <section class="bg-brand-800 dark:bg-brand-950 border-t border-brand-900">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center gap-5">
        <h2 class="font-display text-2xl sm:text-3xl font-bold text-brand-50">Start screening a slice</h2>
        <p class="text-brand-200/80 text-sm max-w-md leading-relaxed">
          Open the workspace as a guest or sign in to keep studies, rename files, and export reports.
        </p>
        <router-link to="/dashboard">
          <BaseButton variant="secondary" size="lg" class="!bg-surface-0 !text-brand-800 hover:!bg-brand-50">
            Open workspace
          </BaseButton>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import BaseButton from '../components/ui/BaseButton.vue';
import HeroSection from '../components/landing/HeroSection.vue';
import StatsSection from '../components/landing/StatsSection.vue';
import FeaturesSection from '../components/landing/FeaturesSection.vue';
import TimelineSection from '../components/landing/TimelineSection.vue';
</script>
