<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { servicesService, ApiError } from '@org/api-client';
import { Card } from '@org/ui';

interface Service {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  pricing_model: string;
}

const services = ref<Service[]>([]);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    services.value = await servicesService.list();
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load services';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Services</h2>

    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <p v-else-if="error" class="text-sm text-danger-600">{{ error }}</p>
    <p v-else-if="!services.length" class="text-sm text-neutral-500">No services available.</p>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <RouterLink v-for="service in services" :key="service.id" :to="`/services/${service.slug}`">
        <Card>
          <p class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ service.name }}</p>
          <p class="text-sm text-neutral-500">
            ${{ service.price }}<span v-if="service.pricing_model === 'hourly'">/hr</span>
          </p>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
