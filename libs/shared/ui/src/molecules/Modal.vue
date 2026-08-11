<script setup lang="ts">
import { watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'md' },
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

function close() {
  emit('update:modelValue', false);
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
  },
);
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="close" />
      <div
        class="relative w-full rounded-lg bg-white shadow-xl dark:bg-neutral-800"
        :class="sizeClasses[size]"
      >
        <div
          v-if="title || $slots.header"
          class="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-700"
        >
          <slot name="header">
            <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {{ title }}
            </h3>
          </slot>
          <button
            type="button"
            class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            @click="close"
          >
            ✕
          </button>
        </div>
        <div class="p-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
