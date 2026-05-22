<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
      statusClasses[status]
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full shrink-0', dotClasses[status]]"></span>
    <slot />
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'neutral',
    validator: (v) => ['neutral', 'tumor', 'no_tumor', 'pending', 'error'].includes(v)
  }
});

const statusClasses = {
  neutral:  'bg-surface-100 text-surface-600',
  tumor:    'bg-danger-50 text-danger-600',
  no_tumor: 'bg-success-50 text-success-600',
  pending:  'bg-brand-50 text-brand-600',
  error:    'bg-warning-50 text-warning-500',
};

const dotClasses = {
  neutral:  'bg-surface-400',
  tumor:    'bg-danger-500',
  no_tumor: 'bg-success-500',
  pending:  'bg-brand-500 animate-pulse',
  error:    'bg-warning-500',
};
</script>
