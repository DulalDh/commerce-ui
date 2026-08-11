<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { tagsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, type TableColumn } from '@org/ui';

interface Tag {
  id: string | number;
  name: string;
  slug: string;
}

const tags = ref<Tag[]>([]);
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

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    tags.value = await tagsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load tags';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.name = '';
  form.slug = '';
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(tag: Tag) {
  editingId.value = tag.id;
  form.name = tag.name;
  form.slug = tag.slug;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (editingId.value) {
      await tagsService.update(editingId.value, { ...form });
    } else {
      await tagsService.create({ ...form });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save tag';
  } finally {
    saving.value = false;
  }
}

async function onDelete(tag: Tag) {
  if (!confirm(`Delete tag "${tag.name}"?`)) return;
  await tagsService.remove(tag.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card title="Tags">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tags</h3>
        <Button size="sm" @click="openCreate">Add tag</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>

    <Table :columns="columns" :rows="tags as never" :loading="loading" row-key="id">
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Tag)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Tag)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit tag' : 'New tag'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
