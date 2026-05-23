<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 flex flex-col">

    <header class="sticky top-0 z-40 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <AppLogo to="/" size="md" />

        <nav class="hidden md:flex items-center gap-1" aria-label="Main">
          <router-link
            to="/"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            :class="route.name === 'landing' ? 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-100' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
          >
            Overview
          </router-link>
          <router-link
            to="/dashboard"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            :class="route.name === 'dashboard' ? 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-100' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
          >
            Dashboard
          </router-link>
          <router-link
            to="/limitations"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            :class="route.name === 'limitations' ? 'bg-surface-100 dark:bg-surface-700' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
          >
            Limitations
          </router-link>
        </nav>

        <div class="hidden md:flex items-center gap-3">
          <BackendStatus />
          <ThemeToggle />
          <router-link to="/dashboard">
            <BaseButton variant="primary" size="sm">
              Analyze a scan
              <ArrowRight class="w-3.5 h-3.5" />
            </BaseButton>
          </router-link>
        </div>

        <button
          type="button"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Menu"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-3 flex flex-col gap-1">
        <router-link to="/" @click="isMobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium">Overview</router-link>
        <router-link to="/dashboard" @click="isMobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium">Dashboard</router-link>
        <router-link to="/limitations" @click="isMobileMenuOpen = false" class="px-3 py-2 rounded-lg text-sm font-medium">Limitations</router-link>
        <div class="pt-2 flex items-center gap-2">
          <BackendStatus />
          <ThemeToggle />
        </div>
        <router-link to="/dashboard" @click="isMobileMenuOpen = false" class="pt-2">
          <BaseButton variant="primary" size="sm" class="w-full">Analyze a scan</BaseButton>
        </router-link>
      </div>
    </header>

    <div class="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 sm:px-6 lg:px-8 py-2.5">
      <p class="max-w-7xl mx-auto text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
        <strong>Not for clinical use.</strong>
        Research and education only — not FDA-cleared. Do not use results for medical decisions.
        <router-link to="/limitations" class="underline font-semibold ml-1">Read limitations</router-link>
      </p>
    </div>

    <main class="flex-grow flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-6">
        <div class="flex flex-col gap-1.5">
          <AppLogo :link="false" size="sm" />
          <p class="text-xs text-surface-400 max-w-xs">Brain MRI tumor screening · research use only</p>
        </div>
        <div class="flex gap-8 text-sm text-surface-500">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-surface-700 dark:text-surface-300">Navigation</span>
            <router-link to="/" class="hover:text-surface-900 dark:hover:text-surface-100">Overview</router-link>
            <router-link to="/dashboard" class="hover:text-surface-900 dark:hover:text-surface-100">Dashboard</router-link>
            <router-link to="/limitations" class="hover:text-surface-900 dark:hover:text-surface-100">Limitations</router-link>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-surface-700 dark:text-surface-300">System</span>
            <span class="text-xs">v{{ CONFIG.VERSION }}</span>
            <button type="button" class="text-xs text-left hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded" @click="app.resetOnboarding()">
              Replay tour
            </button>
          </div>
        </div>
      </div>
      <p class="max-w-7xl mx-auto mt-8 pt-6 border-t border-surface-100 dark:border-surface-700 text-xs text-surface-400">
        © 2026 CerebroAI. Not intended for clinical diagnosis.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowRight, Menu, X } from 'lucide-vue-next';
import BaseButton from '../components/ui/BaseButton.vue';
import AppLogo from '../components/ui/AppLogo.vue';
import BackendStatus from '../components/layout/BackendStatus.vue';
import ThemeToggle from '../components/layout/ThemeToggle.vue';
import { useAppStore } from '../stores/appStore';
import { CONFIG } from '../config';

const route = useRoute();
const app = useAppStore();
const isMobileMenuOpen = ref(false);
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from { opacity: 0; transform: translateY(4px); }
.page-fade-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
