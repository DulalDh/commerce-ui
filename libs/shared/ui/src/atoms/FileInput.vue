<script setup lang="ts">
import { useId } from 'vue';
import FieldWrapper from './FieldWrapper.vue';

withDefaults(
  defineProps<{
    label?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
    required?: boolean;
    accept?: string;
    multiple?: boolean;
  }>(),
  { multiple: false },
);

const emit = defineEmits<{
  change: [files: FileList | null];
}>();

const inputId = useId();

function onChange(event: Event) {
  emit('change', (event.target as HTMLInputElement).files);
}
</script>

<template>
  <FieldWrapper
    :label="label"
    :error="error"
    :hint="hint"
    :required="required"
    :input-id="inputId"
  >
    <input
      :id="inputId"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100"
      @change="onChange"
    />
  </FieldWrapper>
</template>
