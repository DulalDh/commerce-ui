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

function onWheel(event: WheelEvent) {
  (event.target as HTMLInputElement).blur();
}
</script>

<template>
  <FieldWrapper
    :label="label"
    :error="error"
    :hint="hint"
    :required="required"
    :input-id="inputId"
    v-slot="{ descriptionId }"
  >
    <input
      :id="inputId"
      type="number"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      :aria-invalid="!!error"
      :aria-describedby="descriptionId"
      :class="classes"
      @input="onInput"
      @wheel="onWheel"
    />
  </FieldWrapper>
</template>
