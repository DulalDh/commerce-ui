<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { accountService, ApiError } from '@org/api-client';
import { Card, Table, Badge, type TableColumn } from '@org/ui';

interface Order {
  id: string | number;
  reference?: string;
  status: string;
  total: number;
}

interface Booking {
  id: string | number;
  service_name?: string;
  scheduled_date: string;
  status: string;
}

interface Wallet {
  balance?: number;
  currency?: string;
}

interface Loyalty {
  points?: number;
  tier?: string;
}

const orders = ref<Order[]>([]);
const bookings = ref<Booking[]>([]);
const wallet = ref<Wallet | null>(null);
const loyalty = ref<Loyalty | null>(null);
const loading = ref(true);
const error = ref('');

const orderColumns: TableColumn[] = [
  { key: 'reference', label: 'Order' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total' },
];

const bookingColumns: TableColumn[] = [
  { key: 'service_name', label: 'Service' },
  { key: 'scheduled_date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  pending: 'warning',
  confirmed: 'primary',
  processing: 'warning',
  shipped: 'primary',
  accepted: 'primary',
  assigned: 'primary',
  'on the way': 'primary',
  started: 'primary',
  delivered: 'success',
  completed: 'success',
  rejected: 'danger',
  cancelled: 'danger',
};

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const [orderList, bookingList, walletData, loyaltyData] = await Promise.all([
      accountService.orders(),
      accountService.bookings(),
      accountService.wallet(),
      accountService.loyalty(),
    ]);
    orders.value = (orderList as unknown as Order[]).slice(0, 5);
    bookings.value = (bookingList as unknown as Booking[]).slice(0, 5);
    wallet.value = walletData;
    loyalty.value = loyaltyData;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load account data';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">My Account</h2>
    <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card title="Wallet">
        <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
        <p v-else class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {{ wallet?.currency ?? '$' }}{{ wallet?.balance ?? 0 }}
        </p>
      </Card>
      <Card title="Loyalty">
        <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
        <div v-else class="flex items-center gap-2">
          <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{{ loyalty?.points ?? 0 }} pts</p>
          <Badge v-if="loyalty?.tier" variant="primary">{{ loyalty.tier }}</Badge>
        </div>
      </Card>
    </div>

    <Card title="Recent Orders">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Orders</h3>
          <RouterLink to="/account/orders" class="text-sm text-primary-600">View all</RouterLink>
        </div>
      </template>
      <Table :columns="orderColumns" :rows="orders as never" :loading="loading" row-key="id" empty-text="No orders yet.">
        <template #cell-status="{ row }">
          <Badge :variant="statusVariant[(row as Order).status] ?? 'neutral'">{{ (row as Order).status }}</Badge>
        </template>
        <template #cell-total="{ row }">${{ (row as Order).total }}</template>
      </Table>
    </Card>

    <Card title="Recent Bookings">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Bookings</h3>
          <RouterLink to="/account/bookings" class="text-sm text-primary-600">View all</RouterLink>
        </div>
      </template>
      <Table :columns="bookingColumns" :rows="bookings as never" :loading="loading" row-key="id" empty-text="No bookings yet.">
        <template #cell-status="{ row }">
          <Badge :variant="statusVariant[(row as Booking).status] ?? 'neutral'">{{ (row as Booking).status }}</Badge>
        </template>
      </Table>
    </Card>
  </div>
</template>
