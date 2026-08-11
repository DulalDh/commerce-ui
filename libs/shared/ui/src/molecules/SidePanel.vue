<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    side?: 'left' | 'right';
    widthClass?: string;
  }>(),
  { side: 'right', widthClass: 'max-w-md' },
);

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

function close() {
  emit('update:modelValue', false);
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="close" />
      <div
        class="absolute inset-y-0 flex w-full flex-col bg-white shadow-xl dark:bg-neutral-800"
        :class="[widthClass, side === 'right' ? 'right-0' : 'left-0']"
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
        <div class="flex-1 overflow-y-auto p-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
