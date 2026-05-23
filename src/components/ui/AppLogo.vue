<template>
  <router-link
    v-if="link"
    :to="to"
    :class="[
      'inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl',
      className,
    ]"
  >
    <img :src="logoSrc" alt="" :class="iconSizeClass" class="shrink-0" aria-hidden="true" />
    <div v-if="showText" class="flex flex-col min-w-0">
      <span :class="titleClass">{{ CONFIG.APP_NAME }}</span>
      <span v-if="showTagline" :class="taglineClass">{{ CONFIG.APP_TAGLINE }}</span>
    </div>
  </router-link>
  <div v-else :class="['inline-flex items-center gap-2.5', className]">
    <img :src="logoSrc" alt="" :class="iconSizeClass" class="shrink-0" aria-hidden="true" />
    <div v-if="showText" class="flex flex-col min-w-0">
      <span :class="titleClass">{{ CONFIG.APP_NAME }}</span>
      <span v-if="showTagline" :class="taglineClass">{{ CONFIG.APP_TAGLINE }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CONFIG } from '../../config';

const props = defineProps({
  to: { type: [String, Object], default: '/' },
  link: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
  showText: { type: Boolean, default: true },
  showTagline: { type: Boolean, default: false },
  className: { type: String, default: '' },
});

const logoSrc = '/logo.svg';

const iconSizeClass = computed(() => {
  const map = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-10 h-10' };
  return map[props.size] || map.md;
});

const titleClass = computed(() => {
  const map = {
    sm: 'font-display font-bold text-sm text-surface-900 dark:text-surface-50 tracking-tight leading-none',
    md: 'font-display font-bold text-lg text-surface-900 dark:text-surface-50 tracking-tight leading-none',
    lg: 'font-display font-bold text-xl text-surface-900 dark:text-surface-50 tracking-tight leading-none',
  };
  return map[props.size] || map.md;
});

const taglineClass =
  'text-[11px] text-surface-500 dark:text-surface-400 mt-0.5 leading-none font-sans';
</script>
