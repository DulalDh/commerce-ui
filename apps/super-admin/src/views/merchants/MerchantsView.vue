<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { superAdminService, ApiError } from '@org/api-client';
import { Card, Table, Badge, Button, type TableColumn } from '@org/ui';

interface Merchant {
  id: string | number;
  name: string;
  type: string;
  status: string;
}

const merchants = ref<Merchant[]>([]);
const loading = ref(true);
const listError = ref('');
const actioningId = ref<string | number | null>(null);

const columns: TableColumn[] = [
  { key: 'name', label: 'Store name' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  approved: 'success',
  pending: 'warning',
  suspended: 'danger',
};

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    merchants.value = await superAdminService.listMerchants();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load merchants';
  } finally {
    loading.value = false;
  }
}

async function onApprove(merchant: Merchant) {
  actioningId.value = merchant.id;
  try {
    await superAdminService.approveMerchant(merchant.id);
    await load();
  } finally {
    actioningId.value = null;
  }
}

async function onSuspend(merchant: Merchant) {
  if (!confirm(`Suspend "${merchant.name}"?`)) return;
  actioningId.value = merchant.id;
  try {
    await superAdminService.suspendMerchant(merchant.id);
    await load();
  } finally {
    actioningId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <Card title="Merchants & Providers">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="merchants as never" :loading="loading" row-key="id">
      <template #cell-status="{ row }">
        <Badge :variant="statusVariant[(row as Merchant).status] ?? 'neutral'">{{ (row as Merchant).status }}</Badge>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <Button
            v-if="(row as Merchant).status !== 'approved'"
            size="sm"
            variant="secondary"
            :loading="actioningId === (row as Merchant).id"
            @click="onApprove(row as Merchant)"
          >
            Approve
          </Button>
          <Button
            v-if="(row as Merchant).status !== 'suspended'"
            size="sm"
            variant="danger"
            :loading="actioningId === (row as Merchant).id"
            @click="onSuspend(row as Merchant)"
          >
            Suspend
          </Button>
        </div>
      </template>
    </Table>
  </Card>
</template>
