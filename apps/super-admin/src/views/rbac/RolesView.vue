<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { rolesService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, type TableColumn } from '@org/ui';

interface Role {
  id: string | number;
  name: string;
}

const roles = ref<Role[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [{ key: 'name', label: 'Role' }];

const modalOpen = ref(false);
const name = ref('');
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    roles.value = await rolesService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load roles';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  name.value = '';
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    await rolesService.create({ name: name.value });
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to create role';
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
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Roles</h3>
        <Button size="sm" @click="openCreate">Add role</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="roles as never" :loading="loading" row-key="id" />

    <Modal v-model="modalOpen" title="New role">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="name" label="Role name" required />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
