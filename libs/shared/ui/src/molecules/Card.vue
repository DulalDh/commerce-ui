<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    padded?: boolean;
  }>(),
  { padded: true },
);
</script>

<template>
  <div
    class="rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
  >
    <div
      v-if="title || $slots.header"
      class="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700"
    >
      <slot name="header">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {{ title }}
        </h3>
      </slot>
    </div>
    <div :class="padded ? 'p-4' : ''">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
      <slot name="footer" />
    </div>
  </div>
</template>
