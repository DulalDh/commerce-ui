<script setup lang="ts">
import { useId } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  value: string | number;
  name: string;
  label?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const inputId = useId();
</script>

<template>
  <label :for="inputId" class="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
    <input
      :id="inputId"
      type="radio"
      :name="name"
      :checked="modelValue === value"
      :disabled="disabled"
      class="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800"
      @change="emit('update:modelValue', props.value)"
    />
    <span v-if="label">{{ label }}</span>
  </label>
</template>
