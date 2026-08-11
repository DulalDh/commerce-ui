<script setup lang="ts">
const props = defineProps<{
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  inputId: string;
}>();

const descriptionId = `${props.inputId}-description`;
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-neutral-700 dark:text-neutral-200"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    <slot :description-id="error || hint ? descriptionId : undefined" />
    <p v-if="error" :id="descriptionId" role="alert" class="text-xs text-danger-600 dark:text-danger-500">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="descriptionId" class="text-xs text-neutral-500 dark:text-neutral-400">
      {{ hint }}
    </p>
  </div>
</template>
