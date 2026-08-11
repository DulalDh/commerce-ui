<script setup lang="ts">
// Thin semantic alias: use when composing a custom input around FieldWrapper's
// label/error/hint chrome without one of the pre-built atoms.
import FieldWrapper from '../atoms/FieldWrapper.vue';

defineProps<{
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  inputId: string;
}>();
</script>

<template>
  <FieldWrapper
    :label="label"
    :error="error"
    :hint="hint"
    :required="required"
    :input-id="inputId"
  >
    <slot />
  </FieldWrapper>
</template>
