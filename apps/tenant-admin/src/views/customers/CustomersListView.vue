<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { customersService, ApiError } from '@org/api-client';
import { Card, Table, type TableColumn } from '@org/ui';

interface Customer {
  id: string | number;
  name: string;
  email: string;
}

const customers = ref<Customer[]>([]);
const loading = ref(true);
const listError = ref('');
const router = useRouter();

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    customers.value = await customersService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load customers';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Card title="Customers">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table
      :columns="columns"
      :rows="customers as never"
      :loading="loading"
      row-key="id"
      @row-click="(row) => router.push(`/customers/${(row as unknown as Customer).id}`)"
    />
  </Card>
</template>
