<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { accountService, ApiError } from '@org/api-client';
import { Card, Table, Badge, Button, type TableColumn } from '@org/ui';
import ReviewModal from '../../app/ReviewModal.vue';

interface Booking {
  id: string | number;
  service_name?: string;
  scheduled_date: string;
  status: string;
  reviewed?: boolean;
}

const bookings = ref<Booking[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'service_name', label: 'Service' },
  { key: 'scheduled_date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
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

const reviewModalOpen = ref(false);
const reviewingBookingId = ref<string | number | null>(null);

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    bookings.value = await accountService.bookings();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load bookings';
  } finally {
    loading.value = false;
  }
}

function openReview(booking: Booking) {
  reviewingBookingId.value = booking.id;
  reviewModalOpen.value = true;
}

onMounted(load);
</script>

<template>
  <Card title="My Bookings">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="bookings as never" :loading="loading" row-key="id">
      <template #cell-status="{ row }">
        <Badge :variant="statusVariant[(row as Booking).status] ?? 'neutral'">{{ (row as Booking).status }}</Badge>
      </template>
      <template #cell-actions="{ row }">
        <Button
          v-if="(row as Booking).status === 'completed' && !(row as Booking).reviewed"
          size="sm"
          variant="secondary"
          @click="openReview(row as Booking)"
        >
          Leave a review
        </Button>
      </template>
    </Table>

    <ReviewModal v-model="reviewModalOpen" :booking-id="reviewingBookingId" @submitted="load" />
  </Card>
</template>
