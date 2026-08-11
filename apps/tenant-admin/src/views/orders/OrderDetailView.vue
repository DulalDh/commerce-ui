<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ordersService, shippingService, ApiError } from '@org/api-client';
import { Card, Badge, Select, TextInput, Button, Table, type TableColumn } from '@org/ui';

interface OrderItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string | number;
  reference?: string;
  status: string;
  total: number;
  shipping_address?: Record<string, string>;
  items?: OrderItem[];
}

const route = useRoute();
const order = ref<Order | null>(null);
const loading = ref(true);

const itemColumns: TableColumn[] = [
  { key: 'name', label: 'Item' },
  { key: 'quantity', label: 'Qty' },
  { key: 'price', label: 'Price' },
];

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const nextStatus = ref('');
const statusNote = ref('');
const updatingStatus = ref(false);
const statusError = ref('');

const shipment = reactive({ provider: 'pathao' });
const creatingShipment = ref(false);
const shipmentError = ref('');
const shipmentCreated = ref(false);

const shippingRate = ref<number | null>(null);
const rateError = ref('');
const calculatingRate = ref(false);

async function onCalculateRate() {
  if (!order.value?.shipping_address?.city) return;
  rateError.value = '';
  calculatingRate.value = true;
  try {
    const result = (await shippingService.calculateRate({
      provider: shipment.provider,
      origin: 'Dhaka',
      destination: order.value.shipping_address.city,
      weight_kg: 1,
    })) as unknown as { rate?: number; amount?: number };
    shippingRate.value = result.rate ?? result.amount ?? null;
  } catch (err) {
    rateError.value = err instanceof ApiError ? err.message : 'Failed to calculate rate';
  } finally {
    calculatingRate.value = false;
  }
}

async function load() {
  loading.value = true;
  try {
    order.value = await ordersService.get(route.params.id as string);
    nextStatus.value = order.value?.status ?? '';
  } finally {
    loading.value = false;
  }
}

async function onUpdateStatus() {
  if (!order.value) return;
  statusError.value = '';
  updatingStatus.value = true;
  try {
    await ordersService.updateStatus(order.value.id, nextStatus.value);
    await load();
  } catch (err) {
    statusError.value = err instanceof ApiError ? err.message : 'Status update failed';
  } finally {
    updatingStatus.value = false;
  }
}

async function onCreateShipment() {
  if (!order.value) return;
  shipmentError.value = '';
  shipmentCreated.value = false;
  creatingShipment.value = true;
  try {
    await ordersService.createShipment(order.value.id, { provider: shipment.provider });
    shipmentCreated.value = true;
  } catch (err) {
    shipmentError.value = err instanceof ApiError ? err.message : 'Failed to create shipment';
  } finally {
    creatingShipment.value = false;
  }
}

onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <div v-else-if="order" class="flex flex-col gap-6">
    <Card>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Order #{{ order.reference ?? order.id }}
        </h2>
        <Badge variant="primary">{{ order.status }}</Badge>
      </div>
      <p class="mt-2 text-sm text-neutral-500">Total: ${{ order.total }}</p>
    </Card>

    <Card title="Items">
      <Table :columns="itemColumns" :rows="(order.items ?? []) as never" row-key="id">
        <template #cell-price="{ row }">${{ (row as OrderItem).price }}</template>
      </Table>
    </Card>

    <Card title="Update status">
      <form class="flex flex-col gap-4" @submit.prevent="onUpdateStatus">
        <Select v-model="nextStatus" label="Status" :options="statusOptions" />
        <TextInput v-model="statusNote" label="Note" />
        <p v-if="statusError" class="text-sm text-danger-600">{{ statusError }}</p>
        <Button type="submit" :loading="updatingStatus" class="w-fit">Update status</Button>
      </form>
    </Card>

    <Card title="Shipment">
      <form class="flex flex-col gap-4" @submit.prevent="onCreateShipment">
        <Select
          v-model="shipment.provider"
          label="Carrier"
          :options="[{ label: 'Pathao', value: 'pathao' }]"
        />
        <Button type="button" variant="secondary" :loading="calculatingRate" class="w-fit" @click="onCalculateRate">
          Estimate rate
        </Button>
        <p v-if="rateError" class="text-sm text-danger-600">{{ rateError }}</p>
        <p v-else-if="shippingRate !== null" class="text-sm text-neutral-600 dark:text-neutral-300">
          Estimated rate: ${{ shippingRate.toFixed(2) }}
        </p>
        <p v-if="shipmentError" class="text-sm text-danger-600">{{ shipmentError }}</p>
        <p v-if="shipmentCreated" class="text-sm text-success-600">Shipment created.</p>
        <Button type="submit" :loading="creatingShipment" class="w-fit">Create shipment</Button>
      </form>
    </Card>
  </div>
</template>
