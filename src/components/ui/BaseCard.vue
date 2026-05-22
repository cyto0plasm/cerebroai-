<template>
  <div
    :class="[
      'bg-white rounded-xl border transition-shadow duration-200',
      accentClasses[glow],
      paddingClasses[padding],
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  glow: {
    type: String,
    default: 'none',
    validator: (v) => ['none', 'blue', 'green', 'red', 'purple'].includes(v)
  },
  hoverGlow: { type: Boolean, default: false },
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v)
  }
});

const accentClasses = {
  none:   'border-surface-200 shadow-card',
  blue:   'border-surface-200 shadow-card',
  green:  'border-surface-200 shadow-card',
  red:    'border-surface-200 shadow-card',
  purple: 'border-surface-200 shadow-card',
};

const paddingClasses = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};
</script>
