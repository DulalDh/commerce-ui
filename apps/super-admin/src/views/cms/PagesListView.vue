<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { pagesService, ApiError } from '@org/api-client';
import { Card, Table, Button, Badge, type TableColumn } from '@org/ui';

interface Page {
  id: string | number;
  title: string;
  slug: string;
  status: string;
}

const pages = ref<Page[]>([]);
const loading = ref(true);
const listError = ref('');
const router = useRouter();

const columns: TableColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
];

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    pages.value = await pagesService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load pages';
  } finally {
    loading.value = false;
  }
}

async function onDelete(page: Page) {
  if (!confirm(`Delete page "${page.title}"?`)) return;
  await pagesService.remove(page.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Pages</h3>
        <Button size="sm" @click="router.push('/cms/pages/new')">Add page</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="pages as never" :loading="loading" row-key="id">
      <template #cell-status="{ row }">
        <Badge :variant="(row as Page).status === 'published' ? 'success' : 'neutral'">{{ (row as Page).status }}</Badge>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="router.push(`/cms/pages/${(row as Page).id}`)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Page)">Delete</button>
        </div>
      </template>
    </Table>
  </Card>
</template>
