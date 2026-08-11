<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { holidaysService, ApiError } from '@org/api-client';
import { Card, Table, Button, DatePicker, TextInput, type TableColumn } from '@org/ui';

interface Holiday {
  id: string | number;
  date: string;
  name: string;
}

const holidays = ref<Holiday[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Name' },
  { key: 'actions', label: '' },
];

const form = reactive({ date: '', name: '' });
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    holidays.value = await holidaysService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load holidays';
  } finally {
    loading.value = false;
  }
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    await holidaysService.create({ ...form });
    form.date = '';
    form.name = '';
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to add holiday';
  } finally {
    saving.value = false;
  }
}

async function onDelete(holiday: Holiday) {
  if (!confirm(`Delete holiday "${holiday.name}"?`)) return;
  await holidaysService.remove(holiday.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card title="Holidays">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="holidays as never" :loading="loading" row-key="id">
      <template #cell-actions="{ row }">
        <button class="text-danger-600" @click="onDelete(row as Holiday)">Delete</button>
      </template>
    </Table>

    <form class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end" @submit.prevent="onSubmit">
      <DatePicker v-model="form.date" label="Date" required />
      <TextInput v-model="form.name" label="Name" required />
      <Button type="submit" :loading="saving">Add holiday</Button>
    </form>
    <p v-if="formError" class="mt-2 text-sm text-danger-600">{{ formError }}</p>
  </Card>
</template>
