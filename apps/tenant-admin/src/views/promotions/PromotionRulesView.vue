<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { promotionRulesService, productsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, NumberInput, Select, type TableColumn } from '@org/ui';

interface PromotionRule {
  id: string | number;
  name: string;
  type: string;
}

interface Product {
  id: string | number;
  name: string;
}

const rules = ref<PromotionRule[]>([]);
const products = ref<Product[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'actions', label: '' },
];

const ruleType = ref<'bogo' | 'bundle'>('bogo');
const modalOpen = ref(false);
const saving = ref(false);
const formError = ref('');

const bogoForm = reactive({
  name: '',
  buy_product_id: '',
  get_product_id: '',
  buy_qty: 1,
  get_qty: 1,
  get_discount_percentage: 100,
});

const bundleForm = reactive({
  name: '',
  product_ids: [] as (string | number)[],
  bundle_price: null as number | null,
});

const productOptions = ref<{ label: string; value: string | number }[]>([]);

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    const [ruleList, productList] = await Promise.all([promotionRulesService.list(), productsService.list()]);
    rules.value = ruleList;
    products.value = productList;
    productOptions.value = productList.map((p) => ({ label: p.name, value: p.id }));
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load promotion rules';
  } finally {
    loading.value = false;
  }
}

function openCreate(type: 'bogo' | 'bundle') {
  ruleType.value = type;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (ruleType.value === 'bogo') {
      await promotionRulesService.create({
        name: bogoForm.name,
        type: 'bogo',
        config: {
          buy_product_id: bogoForm.buy_product_id,
          get_product_id: bogoForm.get_product_id,
          buy_qty: bogoForm.buy_qty,
          get_qty: bogoForm.get_qty,
          get_discount_percentage: bogoForm.get_discount_percentage,
        },
      });
    } else {
      await promotionRulesService.create({
        name: bundleForm.name,
        type: 'bundle',
        config: {
          product_ids: bundleForm.product_ids,
          bundle_price: bundleForm.bundle_price,
        },
      });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save promotion rule';
  } finally {
    saving.value = false;
  }
}

async function onDelete(rule: PromotionRule) {
  if (!confirm(`Delete rule "${rule.name}"?`)) return;
  await promotionRulesService.remove(rule.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Promotion Rules</h3>
        <div class="flex gap-2">
          <Button size="sm" variant="secondary" @click="openCreate('bogo')">Add BOGO</Button>
          <Button size="sm" variant="secondary" @click="openCreate('bundle')">Add bundle</Button>
        </div>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="rules as never" :loading="loading" row-key="id">
      <template #cell-actions="{ row }">
        <button class="text-danger-600" @click="onDelete(row as PromotionRule)">Delete</button>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="ruleType === 'bogo' ? 'New BOGO rule' : 'New bundle rule'">
      <form v-if="ruleType === 'bogo'" class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="bogoForm.name" label="Name" required />
        <Select v-model="bogoForm.buy_product_id" label="Buy product" :options="productOptions" required />
        <Select v-model="bogoForm.get_product_id" label="Get product" :options="productOptions" required />
        <div class="grid grid-cols-3 gap-4">
          <NumberInput v-model="bogoForm.buy_qty" label="Buy qty" min="1" />
          <NumberInput v-model="bogoForm.get_qty" label="Get qty" min="1" />
          <NumberInput v-model="bogoForm.get_discount_percentage" label="Discount %" min="0" max="100" />
        </div>
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>

      <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="bundleForm.name" label="Name" required />
        <div>
          <p class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">Bundle products</p>
          <select
            v-model="bundleForm.product_ids"
            multiple
            class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option v-for="opt in productOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <NumberInput v-model="bundleForm.bundle_price" label="Bundle price" required min="0" step="0.01" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
