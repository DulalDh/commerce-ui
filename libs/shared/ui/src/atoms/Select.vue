<script setup lang="ts">
import { computed, useId } from 'vue';
import FieldWrapper from './FieldWrapper.vue';
import { inputClasses } from './inputClasses';

export interface SelectOption {
  label: string;
  value: string | number;
}

const props = defineProps<{
  modelValue: string | number | null;
  options: SelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const inputId = useId();
const classes = computed(() => inputClasses(!!props.error));
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
    <select
      :id="inputId"
      :value="modelValue ?? ''"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="descriptionId"
      :class="classes"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </FieldWrapper>
</template>
