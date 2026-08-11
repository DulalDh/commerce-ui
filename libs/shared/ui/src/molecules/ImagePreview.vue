<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    removable?: boolean;
  }>(),
  { alt: '' },
);

defineEmits<{ remove: [] }>();
</script>

<template>
  <div class="group relative h-24 w-24 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
    <img :src="src" :alt="alt" loading="lazy" decoding="async" class="h-full w-full object-cover" />
    <button
      v-if="removable"
      type="button"
      aria-label="Remove image"
      class="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white group-hover:flex"
      @click="$emit('remove')"
    >
      ✕
    </button>
  </div>
</template>
