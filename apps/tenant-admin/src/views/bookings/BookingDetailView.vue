<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { bookingsService, staffService, ApiError } from '@org/api-client';
import { Card, Badge, Select, Button } from '@org/ui';

interface Booking {
  id: string | number;
  service_name?: string;
  scheduled_date: string;
  scheduled_slot_start?: string;
  scheduled_slot_end?: string;
  status: string;
  address?: Record<string, string>;
  notes?: string;
}

const route = useRoute();
const bookingId = route.params.id as string;

const booking = ref<Booking | null>(null);
const staffOptions = ref<{ label: string; value: string | number }[]>([]);
const loading = ref(true);
const actionError = ref('');
const acting = ref(false);
const selectedStaffId = ref('');

const nextStatusOptions = [
  { label: 'On the way', value: 'on the way' },
  { label: 'Started', value: 'started' },
  { label: 'Completed', value: 'completed' },
];
const nextStatus = ref('on the way');

async function load() {
  loading.value = true;
  try {
    const [bookingData, staffList] = await Promise.all([bookingsService.get(bookingId), staffService.list()]);
    booking.value = bookingData;
    staffOptions.value = (staffList as unknown as { id: string | number; name: string }[]).map((s) => ({
      label: s.name,
      value: s.id,
    }));
  } finally {
    loading.value = false;
  }
}

async function onAccept() {
  actionError.value = '';
  acting.value = true;
  try {
    await bookingsService.accept(bookingId);
    await load();
  } catch (err) {
    actionError.value = err instanceof ApiError ? err.message : 'Failed to accept booking';
  } finally {
    acting.value = false;
  }
}

async function onReject() {
  const reason = prompt('Reason for rejection (optional):') ?? undefined;
  actionError.value = '';
  acting.value = true;
  try {
    await bookingsService.reject(bookingId, reason);
    await load();
  } catch (err) {
    actionError.value = err instanceof ApiError ? err.message : 'Failed to reject booking';
  } finally {
    acting.value = false;
  }
}

async function onAssign() {
  if (!selectedStaffId.value) return;
  actionError.value = '';
  acting.value = true;
  try {
    await bookingsService.assign(bookingId, selectedStaffId.value);
    await load();
  } catch (err) {
    actionError.value = err instanceof ApiError ? err.message : 'Failed to assign staff';
  } finally {
    acting.value = false;
  }
}

async function onUpdateStatus() {
  actionError.value = '';
  acting.value = true;
  try {
    await bookingsService.updateStatus(bookingId, nextStatus.value);
    await load();
  } catch (err) {
    actionError.value = err instanceof ApiError ? err.message : 'Failed to update status';
  } finally {
    acting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <div v-else-if="booking" class="flex flex-col gap-6">
    <Card>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Booking #{{ booking.id }}
        </h2>
        <Badge variant="primary">{{ booking.status }}</Badge>
      </div>
      <p class="mt-2 text-sm text-neutral-500">
        {{ booking.scheduled_date }} · {{ booking.scheduled_slot_start }}–{{ booking.scheduled_slot_end }}
      </p>
      <p v-if="booking.address" class="mt-1 text-sm text-neutral-500">
        {{ booking.address.line1 }}, {{ booking.address.city }}
      </p>
      <p v-if="booking.notes" class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{{ booking.notes }}</p>
    </Card>

    <p v-if="actionError" class="text-sm text-danger-600">{{ actionError }}</p>

    <Card title="Actions">
      <div class="flex flex-wrap gap-3">
        <Button size="sm" variant="secondary" :loading="acting" @click="onAccept">Accept</Button>
        <Button size="sm" variant="danger" :loading="acting" @click="onReject">Reject</Button>
      </div>
    </Card>

    <Card title="Assign staff">
      <div class="flex items-end gap-3">
        <Select v-model="selectedStaffId" label="Staff member" :options="staffOptions" class="flex-1" />
        <Button :loading="acting" @click="onAssign">Assign</Button>
      </div>
    </Card>

    <Card title="Update status">
      <div class="flex items-end gap-3">
        <Select v-model="nextStatus" label="Status" :options="nextStatusOptions" class="flex-1" />
        <Button :loading="acting" @click="onUpdateStatus">Update</Button>
      </div>
    </Card>
  </div>
</template>
