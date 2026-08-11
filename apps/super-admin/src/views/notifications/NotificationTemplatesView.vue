<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { notificationTemplatesService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, Textarea, Select, Checkbox, type TableColumn } from '@org/ui';

interface Template {
  id: string | number;
  event_type: string;
  channel: string;
  subject: string;
  is_active: boolean;
}

const templates = ref<Template[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'event_type', label: 'Event' },
  { key: 'channel', label: 'Channel' },
  { key: 'subject', label: 'Subject' },
  { key: 'is_active', label: 'Active' },
  { key: 'actions', label: '' },
];

const channelOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({
  event_type: '',
  channel: 'email',
  subject: '',
  body: '',
  is_active: true,
});
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    templates.value = await notificationTemplatesService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load templates';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.event_type = '';
  form.channel = 'email';
  form.subject = '';
  form.body = '';
  form.is_active = true;
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(template: Template) {
  editingId.value = template.id;
  form.event_type = template.event_type;
  form.channel = template.channel;
  form.subject = template.subject;
  form.body = '';
  form.is_active = template.is_active;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (editingId.value) {
      await notificationTemplatesService.update(editingId.value, { ...form });
    } else {
      await notificationTemplatesService.create({ ...form });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save template';
  } finally {
    saving.value = false;
  }
}

async function onDelete(template: Template) {
  if (!confirm(`Delete template "${template.event_type}"?`)) return;
  await notificationTemplatesService.remove(template.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Notification Templates</h3>
        <Button size="sm" @click="openCreate">Add template</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="templates as never" :loading="loading" row-key="id">
      <template #cell-is_active="{ row }">{{ (row as Template).is_active ? 'Yes' : 'No' }}</template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Template)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Template)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit template' : 'New template'" size="lg">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.event_type" label="Event type" hint="e.g. booking.completed" required />
        <Select v-model="form.channel" label="Channel" :options="channelOptions" />
        <TextInput v-model="form.subject" label="Subject" required />
        <Textarea v-model="form.body" label="Body" rows="4" required />
        <Checkbox v-model="form.is_active" label="Active" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
