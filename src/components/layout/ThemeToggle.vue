<template>
  <button
    type="button"
    @click="app.toggleTheme()"
    class="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    :aria-label="app.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="app.theme === 'dark'" class="w-4 h-4" />
    <Moon v-else class="w-4 h-4" />
  </button>
</template>

<script setup>
import { Sun, Moon } from 'lucide-vue-next';
import { useAppStore } from '../../stores/appStore';

const app = useAppStore();
</script>
