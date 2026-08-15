<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { productsService, ApiError } from '@org/api-client';
import { getFeatureImageUrl, type ProductImage } from '@org/types';
import { Card, Table, Button, Badge, type TableColumn } from '@org/ui';

interface Product {
  id: string | number;
  name: string;
  price: number;
  status: string;
  images?: ProductImage[];
}

const products = ref<Product[]>([]);
const loading = ref(true);
const listError = ref('');
const router = useRouter();

const columns: TableColumn[] = [
  { key: 'image', label: '' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  published: 'success',
  draft: 'neutral',
  pending: 'warning',
};

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    products.value = await productsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load products';
  } finally {
    loading.value = false;
  }
}

async function onDelete(product: Product) {
  if (!confirm(`Delete product "${product.name}"?`)) return;
  await productsService.remove(product.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Products</h3>
        <Button size="sm" @click="router.push('/catalog/products/new')">Add product</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>

    <Table :columns="columns" :rows="products as never" :loading="loading" row-key="id">
      <template #cell-image="{ row }">
        <img
          :src="getFeatureImageUrl((row as Product).images, 'small')"
          :alt="(row as Product).name"
          loading="lazy"
          decoding="async"
          class="h-10 w-10 rounded object-cover"
        />
      </template>
      <template #cell-price="{ row }">${{ (row as Product).price }}</template>
      <template #cell-status="{ row }">
        <Badge :variant="statusVariant[(row as Product).status] ?? 'neutral'">
          {{ (row as Product).status }}
        </Badge>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="router.push(`/catalog/products/${(row as Product).id}`)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Product)">Delete</button>
        </div>
      </template>
    </Table>
  </Card>
</template>
