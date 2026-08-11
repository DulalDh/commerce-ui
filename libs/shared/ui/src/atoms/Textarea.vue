<script setup lang="ts">
import { computed, useId } from 'vue';
import FieldWrapper from './FieldWrapper.vue';
import { inputClasses } from './inputClasses';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    error?: string;
    hint?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
  }>(),
  { rows: 4 },
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
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :aria-invalid="!!error"
      :aria-describedby="descriptionId"
      :class="classes"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </FieldWrapper>
</template>
