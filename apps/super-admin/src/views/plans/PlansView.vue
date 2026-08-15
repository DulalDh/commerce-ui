<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { plansService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, NumberInput, type TableColumn } from '@org/ui';
import { formatCurrency } from '@org/utils';

interface Plan {
  id: string | number;
  name: string;
  slug: string;
  price: number;
}

const plans = ref<Plan[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: '' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({ name: '', slug: '', price: null as number | null, products: null as number | null, staff: null as number | null });
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    plans.value = await plansService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load plans';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.name = '';
  form.slug = '';
  form.price = null;
  form.products = null;
  form.staff = null;
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(plan: Plan) {
  editingId.value = plan.id;
  form.name = plan.name;
  form.slug = plan.slug;
  form.price = plan.price;
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
      price: form.price,
      limits: { products: form.products, staff: form.staff },
    };
    if (editingId.value) {
      await plansService.update(editingId.value, payload);
    } else {
      await plansService.create(payload);
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save plan';
  } finally {
    saving.value = false;
  }
}

async function onDelete(plan: Plan) {
  if (!confirm(`Delete plan "${plan.name}"?`)) return;
  await plansService.remove(plan.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Subscription Plans</h3>
        <Button size="sm" @click="openCreate">Add plan</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="plans as never" :loading="loading" row-key="id">
      <template #cell-price="{ row }">{{ formatCurrency((row as Plan).price) }}</template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Plan)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Plan)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit plan' : 'New plan'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <NumberInput v-model="form.price" label="Price" required min="0" step="0.01" />
        <div class="grid grid-cols-2 gap-4">
          <NumberInput v-model="form.products" label="Product limit" min="0" />
          <NumberInput v-model="form.staff" label="Staff limit" min="0" />
        </div>
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
