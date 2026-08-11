<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { serviceCategoriesService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, Textarea, Select, Checkbox, type TableColumn } from '@org/ui';

interface ServiceCategory {
  id: string | number;
  name: string;
  slug: string;
  parent_id?: string | number | null;
  is_active?: boolean;
}

const categories = ref<ServiceCategory[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'is_active', label: 'Active' },
  { key: 'actions', label: '' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({
  name: '',
  slug: '',
  description: '',
  parent_id: '' as string | number | '',
  is_active: true,
});
const saving = ref(false);
const formError = ref('');

const parentOptions = computed(() =>
  categories.value.filter((c) => c.id !== editingId.value).map((c) => ({ label: c.name, value: c.id })),
);

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    categories.value = await serviceCategoriesService.list();
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
  form.description = '';
  form.parent_id = '';
  form.is_active = true;
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(category: ServiceCategory) {
  editingId.value = category.id;
  form.name = category.name;
  form.slug = category.slug;
  form.description = '';
  form.parent_id = category.parent_id ?? '';
  form.is_active = category.is_active ?? true;
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
      description: form.description,
      parent_id: form.parent_id || null,
      is_active: form.is_active,
    };
    if (editingId.value) {
      await serviceCategoriesService.update(editingId.value, payload);
    } else {
      await serviceCategoriesService.create(payload);
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save category';
  } finally {
    saving.value = false;
  }
}

async function onDelete(category: ServiceCategory) {
  if (!confirm(`Delete category "${category.name}"?`)) return;
  await serviceCategoriesService.remove(category.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Service Categories</h3>
        <Button size="sm" @click="openCreate">Add category</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="categories as never" :loading="loading" row-key="id">
      <template #cell-is_active="{ row }">{{ (row as ServiceCategory).is_active ? 'Yes' : 'No' }}</template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as ServiceCategory)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as ServiceCategory)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit category' : 'New category'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <Textarea v-model="form.description" label="Description" rows="2" />
        <Select v-model="form.parent_id" label="Parent category" :options="parentOptions" placeholder="None (top level)" />
        <Checkbox v-model="form.is_active" label="Active" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
