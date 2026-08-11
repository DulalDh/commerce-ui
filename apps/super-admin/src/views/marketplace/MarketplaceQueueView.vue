<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { marketplaceService, ApiError } from '@org/api-client';
import { Card, Table, Button, type TableColumn } from '@org/ui';

interface QueueItem {
  id: string | number;
  name: string;
  type?: string;
  tenant_name?: string;
}

const items = ref<QueueItem[]>([]);
const loading = ref(true);
const listError = ref('');
const actioningId = ref<string | number | null>(null);

const columns: TableColumn[] = [
  { key: 'name', label: 'Listing' },
  { key: 'tenant_name', label: 'Store' },
  { key: 'actions', label: '' },
];

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    items.value = await marketplaceService.queue();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load queue';
  } finally {
    loading.value = false;
  }
}

async function onApprove(item: QueueItem) {
  actioningId.value = item.id;
  try {
    await marketplaceService.approveListing(item.id);
    await load();
  } finally {
    actioningId.value = null;
  }
}

async function onReject(item: QueueItem) {
  const reason = prompt('Reason for rejection (optional):') ?? undefined;
  actioningId.value = item.id;
  try {
    await marketplaceService.rejectListing(item.id, reason);
    await load();
  } finally {
    actioningId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <Card title="Marketplace Approval Queue">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="items as never" :loading="loading" row-key="id" empty-text="Nothing pending review.">
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <Button size="sm" variant="secondary" :loading="actioningId === (row as QueueItem).id" @click="onApprove(row as QueueItem)">
            Approve
          </Button>
          <Button size="sm" variant="danger" :loading="actioningId === (row as QueueItem).id" @click="onReject(row as QueueItem)">
            Reject
          </Button>
        </div>
      </template>
    </Table>
  </Card>
</template>
