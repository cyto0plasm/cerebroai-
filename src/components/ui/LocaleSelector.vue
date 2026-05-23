<template>
  <div class="flex items-center gap-1">
    <button
      v-for="loc in ['en', 'ar']"
      :key="loc"
      @click="locale = loc"
      :class="[
        'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
        locale === loc
          ? 'bg-brand-600 text-white shadow-md'
          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
      ]"
    >
      {{ loc === 'en' ? 'EN' : 'العربية' }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from '../../composables/useI18n';

const { locale } = useI18n();
</script>
