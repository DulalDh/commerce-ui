<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    removable?: boolean;
    primary?: boolean;
    canSetPrimary?: boolean;
    size?: 'sm' | 'lg';
    status?: 'uploading' | 'error';
    error?: string;
  }>(),
  { alt: '', size: 'sm' },
);

defineEmits<{ remove: []; 'set-primary': []; retry: [] }>();
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-md border-2 transition-colors"
    :class="[
      size === 'lg' ? 'h-56 w-56 sm:h-64 sm:w-64' : 'h-24 w-24',
      primary
        ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-900/40'
        : 'border-neutral-200 dark:border-neutral-700',
    ]"
  >
    <img :src="src" :alt="alt" loading="lazy" decoding="async" class="h-full w-full object-cover" />

    <div
      v-if="status === 'uploading'"
      class="absolute inset-0 flex items-center justify-center bg-black/50"
    >
      <span
        class="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
        aria-label="Uploading"
      />
    </div>

    <div
      v-else-if="status === 'error'"
      class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-danger-900/70 p-1 text-center"
    >
      <span class="text-[10px] font-medium text-white">{{ error || 'Upload failed' }}</span>
      <button
        type="button"
        class="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-neutral-800 hover:bg-white"
        @click="$emit('retry')"
      >
        Retry
      </button>
    </div>

    <span
      v-if="primary"
      class="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow"
    >
      ★ Feature Image
    </span>

    <div class="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        v-if="canSetPrimary && !primary"
        type="button"
        class="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-neutral-800 hover:bg-white"
        @click="$emit('set-primary')"
      >
        Set as feature
      </button>
      <button
        v-if="removable"
        type="button"
        aria-label="Remove image"
        class="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-danger-600"
        @click="$emit('remove')"
      >
        ✕
      </button>
    </div>
  </div>
</template>
