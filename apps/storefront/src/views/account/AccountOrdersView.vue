<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { accountService, ApiError } from '@org/api-client';
import { Card, Table, Badge, type TableColumn } from '@org/ui';

interface Order {
  id: string | number;
  reference?: string;
  status: string;
  total: number;
  created_at?: string;
}

const orders = ref<Order[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'reference', label: 'Order' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total' },
  { key: 'created_at', label: 'Placed' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'warning',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    orders.value = await accountService.orders();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load orders';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Card title="My Orders">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="orders as never" :loading="loading" row-key="id">
      <template #cell-reference="{ row }">#{{ (row as Order).reference ?? (row as Order).id }}</template>
      <template #cell-status="{ row }">
        <Badge :variant="statusVariant[(row as Order).status] ?? 'neutral'">{{ (row as Order).status }}</Badge>
      </template>
      <template #cell-total="{ row }">${{ (row as Order).total }}</template>
    </Table>
  </Card>
</template>
