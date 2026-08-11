<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  inputId: string;
}>();
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
    <slot />
    <p v-if="error" class="text-xs text-danger-600 dark:text-danger-500">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-neutral-500 dark:text-neutral-400">
      {{ hint }}
    </p>
  </div>
</template>
