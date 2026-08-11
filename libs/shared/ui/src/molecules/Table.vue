<script setup lang="ts">
import { computed } from 'vue';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => string;
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    rows: Record<string, unknown>[];
    rowKey?: string;
    loading?: boolean;
    emptyText?: string;
    sortKey?: string | null;
    sortDir?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    total?: number;
  }>(),
  {
    rowKey: 'id',
    emptyText: 'No data',
    sortKey: null,
    sortDir: 'asc',
    page: 1,
    pageSize: 20,
    total: 0,
  },
);

const emit = defineEmits<{
  sort: [key: string];
  'page-change': [page: number];
  'row-click': [row: Record<string, unknown>];
}>();

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

function toggleSort(col: TableColumn) {
  if (!col.sortable) return;
  emit('sort', col.key);
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
    <table class="w-full text-left text-sm">
      <thead class="bg-neutral-50 dark:bg-neutral-700/50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-2.5 font-medium text-neutral-600 dark:text-neutral-300"
            :class="col.sortable ? 'cursor-pointer select-none' : ''"
            @click="toggleSort(col)"
          >
            {{ col.label }}
            <span v-if="sortKey === col.key">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-6 text-center text-neutral-400">
            Loading…
          </td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length" class="px-4 py-6 text-center text-neutral-400">
            {{ emptyText }}
          </td>
        </tr>
        <tr
          v-for="row in rows"
          v-else
          :key="String(row[rowKey])"
          class="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/40"
          @click="emit('row-click', row)"
        >
          <td v-for="col in columns" :key="col.key" class="px-4 py-2.5 text-neutral-800 dark:text-neutral-100">
            <slot :name="`cell-${col.key}`" :row="row">
              {{ col.render ? col.render(row as never) : (row[col.key] ?? '—') }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="total > pageSize"
      class="flex items-center justify-between border-t border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700"
    >
      <span class="text-neutral-500">Page {{ page }} of {{ pageCount }}</span>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded px-2 py-1 text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
          :disabled="page <= 1"
          @click="emit('page-change', page - 1)"
        >
          Prev
        </button>
        <button
          type="button"
          class="rounded px-2 py-1 text-neutral-600 disabled:opacity-40 dark:text-neutral-300"
          :disabled="page >= pageCount"
          @click="emit('page-change', page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
