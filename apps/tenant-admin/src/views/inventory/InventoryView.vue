<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { productsService, inventoryService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, Select, NumberInput, TextInput, type TableColumn } from '@org/ui';

interface Product {
  id: string | number;
  name: string;
  stock?: number;
  variants?: { id: string | number; name: string }[];
}

const products = ref<Product[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Product' },
  { key: 'stock', label: 'Stock on hand' },
];

type ActionKind = 'stock-in' | 'stock-out' | 'adjustment' | 'transfer';
const modalOpen = ref(false);
const activeAction = ref<ActionKind>('stock-in');
const saving = ref(false);
const formError = ref('');

const form = reactive({
  product_id: '',
  quantity: null as number | null,
  delta: null as number | null,
  from_product_id: '',
  to_product_id: '',
  to_variant_id: '',
  notes: '',
});

const productOptions = ref<{ label: string; value: string | number }[]>([]);

const actionTitles: Record<ActionKind, string> = {
  'stock-in': 'Stock in',
  'stock-out': 'Stock out',
  adjustment: 'Adjustment',
  transfer: 'Transfer',
};

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    products.value = await productsService.list();
    productOptions.value = products.value.map((p) => ({ label: p.name, value: p.id }));
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load products';
  } finally {
    loading.value = false;
  }
}

function openAction(kind: ActionKind) {
  activeAction.value = kind;
  form.product_id = '';
  form.quantity = null;
  form.delta = null;
  form.from_product_id = '';
  form.to_product_id = '';
  form.to_variant_id = '';
  form.notes = '';
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (activeAction.value === 'stock-in') {
      await inventoryService.stockIn({ product_id: form.product_id, quantity: form.quantity, notes: form.notes });
    } else if (activeAction.value === 'stock-out') {
      await inventoryService.stockOut({ product_id: form.product_id, quantity: form.quantity, notes: form.notes });
    } else if (activeAction.value === 'adjustment') {
      await inventoryService.adjustment({ product_id: form.product_id, delta: form.delta, notes: form.notes });
    } else {
      await inventoryService.transfer({
        from_product_id: form.from_product_id,
        to_product_id: form.to_product_id,
        to_variant_id: form.to_variant_id || undefined,
        quantity: form.quantity,
        notes: form.notes,
      });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Action failed';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Inventory</h3>
        <div class="flex gap-2">
          <Button size="sm" variant="secondary" @click="openAction('stock-in')">Stock in</Button>
          <Button size="sm" variant="secondary" @click="openAction('stock-out')">Stock out</Button>
          <Button size="sm" variant="secondary" @click="openAction('adjustment')">Adjustment</Button>
          <Button size="sm" variant="secondary" @click="openAction('transfer')">Transfer</Button>
        </div>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="products as never" :loading="loading" row-key="id">
      <template #cell-stock="{ row }">{{ (row as Product).stock ?? '—' }}</template>
    </Table>

    <Modal v-model="modalOpen" :title="actionTitles[activeAction]">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <template v-if="activeAction === 'transfer'">
          <Select v-model="form.from_product_id" label="From product" :options="productOptions" required />
          <Select v-model="form.to_product_id" label="To product" :options="productOptions" required />
          <TextInput v-model="form.to_variant_id" label="To variant ID (optional)" />
        </template>
        <Select v-else v-model="form.product_id" label="Product" :options="productOptions" required />

        <NumberInput v-if="activeAction === 'adjustment'" v-model="form.delta" label="Delta (+/-)" required />
        <NumberInput v-else v-model="form.quantity" label="Quantity" required min="1" />

        <TextInput v-model="form.notes" label="Notes" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Submit</Button>
      </form>
    </Modal>
  </Card>
</template>
