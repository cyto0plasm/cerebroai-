<template>
  <div class="min-h-screen bg-surface-50 text-surface-900 flex flex-col">

    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white border-b border-surface-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 focus:outline-none">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <BrainCircuit class="w-4.5 h-4.5 text-white" style="width:18px;height:18px" />
          </div>
          <span class="font-bold text-lg text-surface-900 tracking-tight">
            Cerebro<span class="text-brand-600">AI</span>
          </span>
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <router-link
            to="/"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.name === 'landing' ? 'bg-surface-100 text-surface-900' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'"
          >
            Overview
          </router-link>
          <router-link
            to="/dashboard"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="route.name === 'dashboard' ? 'bg-surface-100 text-surface-900' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'"
          >
            Dashboard
          </router-link>
        </nav>

        <!-- Right actions -->
        <div class="hidden md:flex items-center gap-3">
          <div class="flex items-center gap-1.5 text-xs font-medium text-success-600">
            <span class="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></span>
            System online
          </div>
          <router-link to="/dashboard">
            <BaseButton variant="primary" size="sm">
              Open Scanner
              <ArrowRight class="w-3.5 h-3.5" />
            </BaseButton>
          </router-link>
        </div>

        <!-- Mobile toggle -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
        >
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-surface-200 bg-white px-4 py-3 flex flex-col gap-1 animate-fade-in">
        <router-link to="/" @click="isMobileMenuOpen = false"
          class="px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-50">
          Overview
        </router-link>
        <router-link to="/dashboard" @click="isMobileMenuOpen = false"
          class="px-3 py-2 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-50">
          Dashboard
        </router-link>
        <div class="pt-3 mt-1 border-t border-surface-100">
          <router-link to="/dashboard" @click="isMobileMenuOpen = false">
            <BaseButton variant="primary" size="sm" class="w-full">
              Open Scanner
            </BaseButton>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Medical disclaimer (always visible) -->
    <div class="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-2.5">
      <p class="max-w-7xl mx-auto text-xs text-amber-900 leading-relaxed">
        <strong>Not for clinical use.</strong>
        This tool is for research and education only. It is not FDA-cleared, not validated for diagnosis,
        and must not replace a qualified radiologist or physician. Do not use results to make medical decisions.
      </p>
    </div>

    <!-- Page content -->
    <main class="flex-grow flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-surface-200 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
              <BrainCircuit class="text-white" style="width:13px;height:13px" />
            </div>
            <span class="font-semibold text-sm text-surface-900">CerebroAI</span>
          </div>
          <p class="text-xs text-surface-400 max-w-xs">
            AI-powered brain MRI tumor detection. For research and educational use only.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-8 text-sm text-surface-500">
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-surface-700 uppercase tracking-wide">Navigation</span>
            <router-link to="/" class="hover:text-surface-900 transition-colors">Overview</router-link>
            <router-link to="/dashboard" class="hover:text-surface-900 transition-colors">Dashboard</router-link>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-xs font-semibold text-surface-700 uppercase tracking-wide">System</span>
            <span class="text-xs text-surface-400">Version 1.2.0</span>
            <span class="text-xs text-surface-400">Cloud demo · not clinical</span>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto mt-8 pt-6 border-t border-surface-100 text-xs text-surface-400">
        © 2026 CerebroAI. Not intended for clinical diagnosis.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { BrainCircuit, ArrowRight, Menu, X } from 'lucide-vue-next';
import BaseButton from '../components/ui/BaseButton.vue';

const route = useRoute();
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
