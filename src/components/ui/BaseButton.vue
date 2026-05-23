<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'group relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'active:scale-[0.97] disabled:opacity-45 disabled:pointer-events-none disabled:active:scale-100',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <span
      v-if="!loading"
      class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      :class="hoverGlow[variant]"
      aria-hidden="true"
    />
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4 shrink-0 relative z-10"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: {
    type: String,
    default: 'secondary',
    validator: (v) => ['primary', 'secondary', 'outline', 'soft', 'danger', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const variantClasses = {
  primary:
    'bg-brand-600 text-white shadow-card hover:bg-brand-500 hover:shadow-glow focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400',
  secondary:
    'bg-surface-0 text-surface-800 border border-surface-200 shadow-card hover:border-brand-300 hover:bg-brand-50 focus-visible:ring-brand-500 dark:bg-surface-800 dark:text-surface-100 dark:border-surface-600 dark:hover:bg-surface-700',
  outline:
    'bg-transparent text-brand-700 border-2 border-brand-600 hover:bg-brand-50 focus-visible:ring-brand-500 dark:text-brand-300 dark:border-brand-400 dark:hover:bg-brand-950',
  soft:
    'bg-brand-50 text-brand-800 hover:bg-brand-100 focus-visible:ring-brand-500 dark:bg-brand-950 dark:text-brand-200 dark:hover:bg-brand-900',
  danger:
    'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500 shadow-card',
  ghost:
    'text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus-visible:ring-brand-500 dark:text-surface-300 dark:hover:bg-surface-800',
};

const hoverGlow = {
  primary: 'bg-gradient-to-r from-brand-400/20 to-accent-400/10',
  secondary: 'bg-brand-500/5',
  outline: 'bg-brand-500/10',
  soft: 'bg-brand-500/10',
  danger: 'bg-danger-400/15',
  ghost: 'bg-surface-500/5',
};

const sizeClasses = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};
</script>
