<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { vehiclesService, staffService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, NumberInput, Select, Checkbox, type TableColumn } from '@org/ui';

interface Vehicle {
  id: string | number;
  type: string;
  registration_number: string;
  capacity_kg: number;
  is_active: boolean;
}

const vehicles = ref<Vehicle[]>([]);
const staffOptions = ref<{ label: string; value: string | number }[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'type', label: 'Type' },
  { key: 'registration_number', label: 'Registration' },
  { key: 'capacity_kg', label: 'Capacity (kg)' },
  { key: 'is_active', label: 'Active' },
  { key: 'actions', label: '' },
];

const typeOptions = [
  { label: 'Van', value: 'van' },
  { label: 'Truck', value: 'truck' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Car', value: 'car' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({
  staff_id: '' as string | number | '',
  type: 'van',
  registration_number: '',
  capacity_kg: null as number | null,
  is_active: true,
});
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    const [vehicleList, staffList] = await Promise.all([vehiclesService.list(), staffService.list()]);
    vehicles.value = vehicleList;
    staffOptions.value = (staffList as unknown as { id: string | number; name: string }[]).map((s) => ({
      label: s.name,
      value: s.id,
    }));
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load vehicles';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.staff_id = '';
  form.type = 'van';
  form.registration_number = '';
  form.capacity_kg = null;
  form.is_active = true;
  formError.value = '';
  modalOpen.value = true;
}

function openEdit(vehicle: Vehicle) {
  editingId.value = vehicle.id;
  form.type = vehicle.type;
  form.registration_number = vehicle.registration_number;
  form.capacity_kg = vehicle.capacity_kg;
  form.is_active = vehicle.is_active;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    const payload = {
      staff_id: form.staff_id || undefined,
      type: form.type,
      registration_number: form.registration_number,
      capacity_kg: form.capacity_kg,
      is_active: form.is_active,
    };
    if (editingId.value) {
      await vehiclesService.update(editingId.value, payload);
    } else {
      await vehiclesService.create(payload);
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save vehicle';
  } finally {
    saving.value = false;
  }
}

async function onDelete(vehicle: Vehicle) {
  if (!confirm(`Delete vehicle "${vehicle.registration_number}"?`)) return;
  await vehiclesService.remove(vehicle.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Vehicles</h3>
        <Button size="sm" @click="openCreate">Add vehicle</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="vehicles as never" :loading="loading" row-key="id">
      <template #cell-is_active="{ row }">{{ (row as Vehicle).is_active ? 'Yes' : 'No' }}</template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as Vehicle)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as Vehicle)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit vehicle' : 'New vehicle'">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <Select v-model="form.staff_id" label="Assigned staff" :options="staffOptions" placeholder="Unassigned" />
        <Select v-model="form.type" label="Type" :options="typeOptions" />
        <TextInput v-model="form.registration_number" label="Registration number" required />
        <NumberInput v-model="form.capacity_kg" label="Capacity (kg)" min="0" />
        <Checkbox v-model="form.is_active" label="Active" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
