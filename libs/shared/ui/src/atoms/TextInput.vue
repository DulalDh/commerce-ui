<script setup lang="ts">
import { computed, useId } from 'vue';
import FieldWrapper from './FieldWrapper.vue';
import { inputClasses } from './inputClasses';

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    label?: string;
    error?: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    type?: 'text' | 'email' | 'tel' | 'url' | 'search';
  }>(),
  { type: 'text' },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
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
    <input
      :id="inputId"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="descriptionId"
      :class="classes"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </FieldWrapper>
</template>
