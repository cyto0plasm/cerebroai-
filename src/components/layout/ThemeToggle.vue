<template>
  <div class="flex items-center gap-1">
    <button
      type="button"
      @click="app.toggleTheme()"
      class="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
      :aria-label="app.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <Sun v-if="app.theme === 'dark'" class="w-4 h-4" />
      <Moon v-else class="w-4 h-4" />
    </button>
    <button
      type="button"
      @click="app.setHighContrast(!app.highContrast)"
      :class="[
        'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500',
        app.highContrast ? 'bg-brand-100 text-brand-700' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800',
      ]"
      aria-label="Toggle high contrast"
      title="High contrast"
    >
      <Contrast class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { Sun, Moon, Contrast } from 'lucide-vue-next';
import { useAppStore } from '../../stores/appStore';

const app = useAppStore();
</script>
