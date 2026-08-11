<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { flashSalesService, productsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, NumberInput, DatePicker, Checkbox, type TableColumn } from '@org/ui';

interface FlashSale {
  id: string | number;
  name: string;
  discount_percentage: number;
  starts_at: string;
  ends_at: string;
}

interface Product {
  id: string | number;
  name: string;
}

const flashSales = ref<FlashSale[]>([]);
const products = ref<Product[]>([]);
const selectedProductIds = ref<Set<string | number>>(new Set());
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'discount_percentage', label: 'Discount' },
  { key: 'starts_at', label: 'Starts' },
  { key: 'ends_at', label: 'Ends' },
  { key: 'actions', label: '' },
];

const modalOpen = ref(false);
const form = reactive({ name: '', discount_percentage: null as number | null, starts_at: '', ends_at: '' });
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    const [saleList, productList] = await Promise.all([flashSalesService.list(), productsService.list()]);
    flashSales.value = saleList;
    products.value = productList;
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load flash sales';
  } finally {
    loading.value = false;
  }
}

function toggleProduct(id: string | number) {
  if (selectedProductIds.value.has(id)) selectedProductIds.value.delete(id);
  else selectedProductIds.value.add(id);
}

function openCreate() {
  form.name = '';
  form.discount_percentage = null;
  form.starts_at = '';
  form.ends_at = '';
  selectedProductIds.value = new Set();
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    await flashSalesService.create({
      name: form.name,
      discount_percentage: form.discount_percentage,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      product_ids: Array.from(selectedProductIds.value),
    });
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save flash sale';
  } finally {
    saving.value = false;
  }
}

async function onDelete(sale: FlashSale) {
  if (!confirm(`Delete flash sale "${sale.name}"?`)) return;
  await flashSalesService.remove(sale.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Flash Sales</h3>
        <Button size="sm" @click="openCreate">Add flash sale</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="flashSales as never" :loading="loading" row-key="id">
      <template #cell-discount_percentage="{ row }">{{ (row as FlashSale).discount_percentage }}%</template>
      <template #cell-actions="{ row }">
        <button class="text-danger-600" @click="onDelete(row as FlashSale)">Delete</button>
      </template>
    </Table>

    <Modal v-model="modalOpen" title="New flash sale" size="lg">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required />
        <NumberInput v-model="form.discount_percentage" label="Discount %" required min="0" max="100" />
        <div class="grid grid-cols-2 gap-4">
          <DatePicker v-model="form.starts_at" type="datetime-local" label="Starts" required />
          <DatePicker v-model="form.ends_at" type="datetime-local" label="Ends" required />
        </div>
        <div>
          <p class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">Products</p>
          <div class="flex max-h-40 flex-col gap-2 overflow-y-auto">
            <Checkbox
              v-for="product in products"
              :key="product.id"
              :model-value="selectedProductIds.has(product.id)"
              :label="product.name"
              @update:model-value="toggleProduct(product.id)"
            />
          </div>
        </div>
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
