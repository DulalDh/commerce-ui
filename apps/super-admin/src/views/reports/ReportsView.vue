<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reportsService } from '@org/api-client';
import { normalizeChartData } from '@org/utils';
import { Card, BarChart, type ChartPoint } from '@org/ui';

const sales = ref<ChartPoint[]>([]);
const bookings = ref<ChartPoint[]>([]);
const providerPerformance = ref<ChartPoint[]>([]);
const topSelling = ref<ChartPoint[]>([]);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const [salesData, bookingsData, performanceData, topSellingData] = await Promise.all([
      reportsService.sales(),
      reportsService.bookings(),
      reportsService.providerPerformance(),
      reportsService.topSelling(),
    ]);
    sales.value = normalizeChartData(salesData);
    bookings.value = normalizeChartData(bookingsData);
    providerPerformance.value = normalizeChartData(performanceData);
    topSelling.value = normalizeChartData(topSellingData);
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card title="Platform Sales">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <BarChart v-else :data="sales" />
    </Card>

    <Card title="Bookings">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <BarChart v-else :data="bookings" />
    </Card>

    <Card title="Provider Performance">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <BarChart v-else :data="providerPerformance" />
    </Card>

    <Card title="Top Selling">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <BarChart v-else :data="topSelling" />
    </Card>
  </div>
</template>
