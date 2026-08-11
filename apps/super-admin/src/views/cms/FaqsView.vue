<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { faqsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, Textarea, NumberInput, Checkbox, type TableColumn } from '@org/ui';

interface Faq {
  id: string | number;
  question: string;
  position: number;
  is_active: boolean;
}

const faqs = ref<Faq[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'question', label: 'Question' },
  { key: 'position', label: 'Position' },
  { key: 'is_active', label: 'Active' },
  { key: 'actions', label: '' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({ question: '', answer: '', position: 1, is_active: true });
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    faqs.value = await faqsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load FAQs';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.question = '';
  form.answer = '';
  form.position = faqs.value.length + 1;
  form.is_active = true;
  formError.value = '';
  modalOpen.value = true;
}

async function openEdit(faq: Faq) {
  editingId.value = faq.id;
  const full = (await faqsService.get(faq.id)) as unknown as { question: string; answer: string; position: number; is_active: boolean };
  form.question = full.question;
  form.answer = full.answer;
  form.position = full.position;
  form.is_active = full.is_active;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (editingId.value) {
      await faqsService.update(editingId.value, { ...form });
    } else {
      await faqsService.create({ ...form });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save FAQ';
  } finally {
    saving.value = false;
  }
}

async function onDelete(faq: Faq) {
  if (!confirm(`Delete FAQ "${faq.question}"?`)) return;
  await faqsService.remove(faq.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">FAQs</h3>
        <Button size="sm" @click="openCreate">Add FAQ</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="faqs as never" :loading="loading" row-key="id">
      <template #cell-is_active="{ row }">{{ (row as Faq).is_active ? 'Yes' : 'No' }}</template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Faq)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Faq)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit FAQ' : 'New FAQ'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.question" label="Question" required />
        <Textarea v-model="form.answer" label="Answer" rows="3" required />
        <NumberInput v-model="form.position" label="Position" min="1" />
        <Checkbox v-model="form.is_active" label="Active" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
