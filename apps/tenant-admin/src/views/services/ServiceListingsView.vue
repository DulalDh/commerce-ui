<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { servicesService, ApiError } from '@org/api-client';
import { Card, Table, Button, Badge, type TableColumn } from '@org/ui';
import { formatCurrency } from '@org/utils';

interface Service {
  id: string | number;
  name: string;
  price: number;
  pricing_model: string;
  status: string;
}

const services = ref<Service[]>([]);
const loading = ref(true);
const listError = ref('');
const router = useRouter();

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'pricing_model', label: 'Pricing' },
  { key: 'price', label: 'Price' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  published: 'success',
  draft: 'neutral',
};

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    services.value = await servicesService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load services';
  } finally {
    loading.value = false;
  }
}

async function onDelete(service: Service) {
  if (!confirm(`Delete service "${service.name}"?`)) return;
  await servicesService.remove(service.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Service Listings</h3>
        <Button size="sm" @click="router.push('/services/listings/new')">Add service</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="services as never" :loading="loading" row-key="id">
      <template #cell-price="{ row }">{{ formatCurrency((row as Service).price) }}</template>
      <template #cell-status="{ row }">
        <Badge :variant="statusVariant[(row as Service).status] ?? 'neutral'">{{ (row as Service).status }}</Badge>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="router.push(`/services/listings/${(row as Service).id}`)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Service)">Delete</button>
        </div>
      </template>
    </Table>
  </Card>
</template>
