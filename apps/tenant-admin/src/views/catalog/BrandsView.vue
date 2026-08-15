<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { brandsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, type TableColumn } from '@org/ui';
import { useSlug } from '@/composables/useSlug';

interface Brand {
  id: string | number;
  name: string;
  slug: string;
}

const brands = ref<Brand[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'actions', label: '' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({ name: '', slug: '' });
const saving = ref(false);
const formError = ref('');
const { onNameInput, onSlugInput, reset: resetSlug } = useSlug((slug) => (form.slug = slug));

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    brands.value = await brandsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load brands';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.name = '';
  form.slug = '';
  resetSlug(false);
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(brand: Brand) {
  editingId.value = brand.id;
  form.name = brand.name;
  form.slug = brand.slug;
  resetSlug(true);
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (editingId.value) {
      await brandsService.update(editingId.value, { ...form });
    } else {
      await brandsService.create({ ...form });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save brand';
  } finally {
    saving.value = false;
  }
}

async function onDelete(brand: Brand) {
  if (!confirm(`Delete brand "${brand.name}"?`)) return;
  await brandsService.remove(brand.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card title="Brands">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Brands</h3>
        <Button size="sm" @click="openCreate">Add brand</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>

    <Table :columns="columns" :rows="brands as never" :loading="loading" row-key="id">
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Brand)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Brand)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit brand' : 'New brand'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required @input="onNameInput(form.name)" />
        <TextInput v-model="form.slug" label="Slug" required @input="onSlugInput" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
