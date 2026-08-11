<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { staffService, ApiError } from '@org/api-client';
import { Card, TextInput, DatePicker, Button, Table, type TableColumn } from '@org/ui';

interface Staff {
  id: string | number;
  name: string;
  email: string;
  role: string;
}

interface Leave {
  id: string | number;
  starts_on: string;
  ends_on: string;
  reason?: string;
}

interface ScheduleEntry {
  date: string;
  bookings?: number;
}

const route = useRoute();
const staffId = route.params.id as string;

const staff = ref<Staff | null>(null);
const leaves = ref<Leave[]>([]);
const schedule = ref<ScheduleEntry[]>([]);
const loading = ref(true);

const leaveColumns: TableColumn[] = [
  { key: 'starts_on', label: 'From' },
  { key: 'ends_on', label: 'To' },
  { key: 'reason', label: 'Reason' },
  { key: 'actions', label: '' },
];

const newLeave = reactive({ starts_on: '', ends_on: '', reason: '' });
const addingLeave = ref(false);
const leaveError = ref('');

async function load() {
  loading.value = true;
  try {
    const [staffData, leaveList, scheduleData] = await Promise.all([
      staffService.get(staffId),
      staffService.listLeaves(staffId),
      staffService.schedule(staffId),
    ]);
    staff.value = staffData;
    leaves.value = leaveList;
    schedule.value = (scheduleData as unknown as ScheduleEntry[]) ?? [];
  } finally {
    loading.value = false;
  }
}

async function onAddLeave() {
  leaveError.value = '';
  addingLeave.value = true;
  try {
    await staffService.createLeave(staffId, { ...newLeave });
    newLeave.starts_on = '';
    newLeave.ends_on = '';
    newLeave.reason = '';
    leaves.value = await staffService.listLeaves(staffId);
  } catch (err) {
    leaveError.value = err instanceof ApiError ? err.message : 'Failed to add leave';
  } finally {
    addingLeave.value = false;
  }
}

async function onDeleteLeave(leave: Leave) {
  await staffService.deleteLeave(staffId, leave.id);
  leaves.value = await staffService.listLeaves(staffId);
}

onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <div v-else-if="staff" class="flex flex-col gap-6">
    <Card>
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ staff.name }}</h2>
      <p class="text-sm text-neutral-500">{{ staff.email }} · {{ staff.role }}</p>
    </Card>

    <Card title="Leaves">
      <Table :columns="leaveColumns" :rows="leaves as never" row-key="id" empty-text="No leaves recorded.">
        <template #cell-actions="{ row }">
          <button class="text-danger-600" @click="onDeleteLeave(row as Leave)">Delete</button>
        </template>
      </Table>

      <form class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end" @submit.prevent="onAddLeave">
        <DatePicker v-model="newLeave.starts_on" label="From" required />
        <DatePicker v-model="newLeave.ends_on" label="To" required />
        <TextInput v-model="newLeave.reason" label="Reason" />
        <Button type="submit" :loading="addingLeave">Add leave</Button>
      </form>
      <p v-if="leaveError" class="mt-2 text-sm text-danger-600">{{ leaveError }}</p>
    </Card>

    <Card title="Schedule">
      <p v-if="!schedule.length" class="text-sm text-neutral-500">No upcoming schedule.</p>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="entry in schedule"
          :key="entry.date"
          class="flex justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700"
        >
          <span>{{ entry.date }}</span>
          <span class="text-neutral-500">{{ entry.bookings ?? 0 }} bookings</span>
        </div>
      </div>
    </Card>
  </div>
</template>
