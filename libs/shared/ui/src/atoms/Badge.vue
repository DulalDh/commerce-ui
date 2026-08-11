<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  }>(),
  { variant: 'neutral' },
);

const variantClasses: Record<string, string> = {
  neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  success: 'bg-success-500/10 text-success-600 dark:text-success-500',
  warning: 'bg-warning-500/10 text-warning-600 dark:text-warning-500',
  danger: 'bg-danger-500/10 text-danger-600 dark:text-danger-500',
};
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="variantClasses[variant]"
  >
    <slot />
  </span>
</template>
