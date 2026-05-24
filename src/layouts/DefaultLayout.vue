<template>
  <div class="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950 text-surface-800 dark:text-surface-100">
    <header class="sticky top-0 z-40 border-b border-surface-200/80 dark:border-surface-800 bg-surface-0/95 dark:bg-surface-900/95 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <AppLogo to="/" size="md" />

        <nav class="hidden md:flex items-center gap-1" aria-label="Main">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            :class="route.name === link.name ? 'bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-200' : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <div class="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <router-link v-if="route.name !== 'dashboard'" to="/dashboard">
            <BaseButton variant="primary" size="sm">Open workspace</BaseButton>
          </router-link>
        </div>

        <button
          type="button"
          class="md:hidden p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-surface-200 dark:border-surface-800 px-4 py-3 flex flex-col gap-1">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-2 rounded-xl text-sm font-medium"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
        <div class="pt-2 flex items-center gap-2">
          <ThemeToggle />
          <router-link v-if="route.name !== 'dashboard'" to="/dashboard" @click="isMobileMenuOpen = false">
            <BaseButton variant="primary" size="sm">Open workspace</BaseButton>
          </router-link>
        </div>
      </div>
    </header>

    <div class="border-b border-surface-200/60 dark:border-surface-800 bg-surface-100/50 dark:bg-surface-900/80 px-4 sm:px-6 lg:px-8 py-2">
      <p class="max-w-7xl mx-auto text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">
        <strong class="text-surface-700 dark:text-surface-300">Research &amp; education only.</strong>
        Not for clinical diagnosis.
        <router-link to="/limitations" class="text-brand-600 dark:text-brand-400 font-semibold ml-1 hover:underline">Limitations</router-link>
      </p>
    </div>

    <main class="flex-grow flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="border-t border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between gap-6">
        <AppLogo :link="false" size="sm" show-tagline />
        <div class="flex gap-10 text-sm text-surface-500">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-surface-600 dark:text-surface-400">Navigate</span>
            <router-link v-for="link in navLinks" :key="link.to" :to="link.to" class="hover:text-brand-600 dark:hover:text-brand-400">{{ link.label }}</router-link>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-surface-600 dark:text-surface-400">App</span>
            <span class="text-xs">v{{ CONFIG.VERSION }}</span>
            <button type="button" class="text-xs text-left hover:text-brand-600 dark:hover:text-brand-400" @click="app.resetOnboarding(); clearGuestSessionChoice()">
              Replay introduction
            </button>
          </div>
        </div>
      </div>
      <p class="max-w-7xl mx-auto mt-8 pt-6 border-t border-surface-100 dark:border-surface-800 text-xs text-surface-400">
        © {{ year }} {{ CONFIG.APP_NAME }}. Not for clinical use.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, X } from 'lucide-vue-next';
import BaseButton from '../components/ui/BaseButton.vue';
import AppLogo from '../components/ui/AppLogo.vue';
import ThemeToggle from '../components/layout/ThemeToggle.vue';
import { useAppStore } from '../stores/appStore';
import { CONFIG } from '../config';
import { clearGuestSessionChoice } from '../utils/guestSession';

const route = useRoute();
const app = useAppStore();
const isMobileMenuOpen = ref(false);
const year = new Date().getFullYear();

const navLinks = [
  { to: '/', name: 'landing', label: 'Overview' },
  { to: '/dashboard', name: 'dashboard', label: 'Workspace' },
  { to: '/profile', name: 'profile', label: 'Profile' },
  { to: '/limitations', name: 'limitations', label: 'Limitations' },
];
</script>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from { opacity: 0; transform: translateY(6px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
