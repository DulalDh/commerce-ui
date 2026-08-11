<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { bookingsService, ApiError } from '@org/api-client';
import { Card, Table, Badge, type TableColumn } from '@org/ui';

interface Booking {
  id: string | number;
  service_name?: string;
  scheduled_date: string;
  status: string;
}

const bookings = ref<Booking[]>([]);
const loading = ref(true);
const listError = ref('');
const router = useRouter();

const columns: TableColumn[] = [
  { key: 'service_name', label: 'Service' },
  { key: 'scheduled_date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  pending: 'warning',
  accepted: 'primary',
  assigned: 'primary',
  'on the way': 'primary',
  started: 'primary',
  completed: 'success',
  rejected: 'danger',
  cancelled: 'danger',
};

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    bookings.value = await bookingsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load bookings';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Card title="Bookings">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table
      :columns="columns"
      :rows="bookings as never"
      :loading="loading"
      row-key="id"
      @row-click="(row) => router.push(`/bookings/${(row as unknown as Booking).id}`)"
    >
      <template #cell-status="{ row }">
        <Badge :variant="statusVariant[(row as Booking).status] ?? 'neutral'">{{ (row as Booking).status }}</Badge>
      </template>
    </Table>
  </Card>
</template>
