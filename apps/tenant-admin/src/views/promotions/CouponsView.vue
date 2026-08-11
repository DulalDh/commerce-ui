<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { couponsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, NumberInput, Select, type TableColumn } from '@org/ui';

interface Coupon {
  id: string | number;
  code: string;
  type: string;
  value: number;
}

const coupons = ref<Coupon[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'code', label: 'Code' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value' },
  { key: 'actions', label: '' },
];

const typeOptions = [
  { label: 'Percentage', value: 'percentage' },
  { label: 'Fixed amount', value: 'fixed' },
];

const modalOpen = ref(false);
const form = reactive({ code: '', type: 'percentage', value: null as number | null, max_discount: null as number | null });
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    coupons.value = await couponsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load coupons';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  form.code = '';
  form.type = 'percentage';
  form.value = null;
  form.max_discount = null;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    await couponsService.create({ ...form });
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save coupon';
  } finally {
    saving.value = false;
  }
}

async function onDelete(coupon: Coupon) {
  if (!confirm(`Delete coupon "${coupon.code}"?`)) return;
  await couponsService.remove(coupon.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Coupons</h3>
        <Button size="sm" @click="openCreate">Add coupon</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="coupons as never" :loading="loading" row-key="id">
      <template #cell-actions="{ row }">
        <button class="text-danger-600" @click="onDelete(row as Coupon)">Delete</button>
      </template>
    </Table>

    <Modal v-model="modalOpen" title="New coupon">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.code" label="Code" required />
        <Select v-model="form.type" label="Type" :options="typeOptions" />
        <NumberInput v-model="form.value" label="Value" required min="0" />
        <NumberInput v-model="form.max_discount" label="Max discount (optional)" min="0" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
