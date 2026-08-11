<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { categoriesService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, Select, type TableColumn } from '@org/ui';

interface Category {
  id: string | number;
  name: string;
  slug: string;
  parent_id?: string | number | null;
}

const categories = ref<Category[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'parent', label: 'Parent' },
  { key: 'actions', label: '' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({ name: '', slug: '', parent_id: '' as string | number | '' });
const saving = ref(false);
const formError = ref('');

const parentOptions = computed(() =>
  categories.value
    .filter((c) => c.id !== editingId.value)
    .map((c) => ({ label: c.name, value: c.id })),
);

function parentName(id?: string | number | null) {
  return categories.value.find((c) => c.id === id)?.name ?? '—';
}

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    categories.value = await categoriesService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load categories';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.name = '';
  form.slug = '';
  form.parent_id = '';
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(category: Category) {
  editingId.value = category.id;
  form.name = category.name;
  form.slug = category.slug;
  form.parent_id = category.parent_id ?? '';
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      parent_id: form.parent_id || null,
    };
    if (editingId.value) {
      await categoriesService.update(editingId.value, payload);
    } else {
      await categoriesService.create(payload);
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save category';
  } finally {
    saving.value = false;
  }
}

async function onDelete(category: Category) {
  if (!confirm(`Delete category "${category.name}"?`)) return;
  await categoriesService.remove(category.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card title="Categories">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Categories</h3>
        <Button size="sm" @click="openCreate">Add category</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>

    <Table :columns="columns" :rows="categories as never" :loading="loading" row-key="id">
      <template #cell-parent="{ row }">{{ parentName((row as Category).parent_id) }}</template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Category)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Category)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit category' : 'New category'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <Select v-model="form.parent_id" label="Parent category" :options="parentOptions" placeholder="None (top level)" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
