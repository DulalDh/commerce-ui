<script setup lang="ts">
import { computed } from 'vue';

export interface ChartPoint {
  label: string;
  value: number;
}

const props = withDefaults(
  defineProps<{
    data: ChartPoint[];
    height?: number;
  }>(),
  { height: 160 },
);

const max = computed(() => Math.max(1, ...props.data.map((d) => d.value)));
</script>

<template>
  <div class="w-full">
    <div v-if="!data.length" class="flex h-32 items-center justify-center text-sm text-neutral-400">
      No data
    </div>
    <div v-else class="flex items-end gap-2 overflow-x-auto" :style="{ height: `${height}px` }">
      <div
        v-for="point in data"
        :key="point.label"
        class="flex min-w-[2.5rem] flex-1 flex-col items-center justify-end gap-1"
      >
        <span class="text-[10px] font-medium text-neutral-600 dark:text-neutral-300">{{ point.value }}</span>
        <div
          class="w-full rounded-t bg-primary-500 transition-all dark:bg-primary-600"
          :style="{ height: `${Math.max(2, (point.value / max) * (height - 32))}px` }"
        />
        <span class="max-w-[3rem] truncate text-[10px] text-neutral-500" :title="point.label">
          {{ point.label }}
        </span>
      </div>
    </div>
  </div>
</template>
