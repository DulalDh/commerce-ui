<script setup lang="ts">
import { computed, useId } from 'vue';
import FieldWrapper from './FieldWrapper.vue';
import { inputClasses } from './inputClasses';

const props = defineProps<{
  modelValue: number | null;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
}>();

const inputId = useId();
const classes = computed(() => inputClasses(!!props.error));

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  emit('update:modelValue', raw === '' ? null : Number(raw));
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
      type="number"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :class="classes"
      @input="onInput"
    />
  </FieldWrapper>
</template>
