<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { staffService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, Select, Checkbox, type TableColumn } from '@org/ui';

interface Staff {
  id: string | number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

const staff = ref<Staff[]>([]);
const loading = ref(true);
const listError = ref('');
const router = useRouter();

const columns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'is_active', label: 'Active' },
];

const modalOpen = ref(false);
const form = reactive({ name: '', email: '', phone: '', role: 'cleaner', is_active: true });
const saving = ref(false);
const formError = ref('');

const roleOptions = [
  { label: 'Cleaner', value: 'cleaner' },
  { label: 'Technician', value: 'technician' },
  { label: 'Driver', value: 'driver' },
  { label: 'Supervisor', value: 'supervisor' },
];

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    staff.value = await staffService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load staff';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  form.name = '';
  form.email = '';
  form.phone = '';
  form.role = 'cleaner';
  form.is_active = true;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    await staffService.create({ ...form });
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save staff member';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Staff</h3>
        <Button size="sm" @click="openCreate">Add staff</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table
      :columns="columns"
      :rows="staff as never"
      :loading="loading"
      row-key="id"
      @row-click="(row) => router.push(`/services/staff/${(row as unknown as Staff).id}`)"
    >
      <template #cell-is_active="{ row }">{{ (row as Staff).is_active ? 'Yes' : 'No' }}</template>
    </Table>

    <Modal v-model="modalOpen" title="New staff member">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.name" label="Name" required />
        <TextInput v-model="form.email" type="email" label="Email" required />
        <TextInput v-model="form.phone" label="Phone" />
        <Select v-model="form.role" label="Role" :options="roleOptions" />
        <Checkbox v-model="form.is_active" label="Active" />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
