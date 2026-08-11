<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      class="relative h-5 w-9 rounded-full transition-colors disabled:opacity-50"
      :class="modelValue ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        class="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
        :class="modelValue ? 'translate-x-4' : 'translate-x-0.5'"
      />
    </button>
    <span v-if="label" class="text-sm text-neutral-700 dark:text-neutral-200">{{ label }}</span>
  </label>
</template>
