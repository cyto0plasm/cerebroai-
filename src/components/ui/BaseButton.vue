<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size]
    ]"
    :disabled="disabled || loading"
  >
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'secondary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: { type: Boolean, default: false },
  loading:  { type: Boolean, default: false }
});

const variantClasses = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
  secondary: 'bg-white text-surface-700 border border-surface-200 hover:bg-surface-50 hover:border-surface-300 focus:ring-brand-500',
  danger:    'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
  ghost:     'text-surface-600 hover:bg-surface-100 hover:text-surface-900 focus:ring-brand-500',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};
</script>
