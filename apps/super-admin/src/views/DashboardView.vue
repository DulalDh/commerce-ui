<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { superAdminService, ApiError } from '@org/api-client';
import { Card } from '@org/ui';

const stats = ref<Record<string, unknown>>({});
const loading = ref(true);
const error = ref('');

function pick(...keys: string[]) {
  for (const key of keys) {
    if (stats.value[key] !== undefined) return stats.value[key] as string | number;
  }
  return '—';
}

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    stats.value = await superAdminService.dashboard();
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load dashboard stats';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card title="Merchants">
        <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {{ loading ? '…' : pick('merchants_count', 'total_merchants', 'merchants') }}
        </p>
      </Card>
      <Card title="Pending Approvals">
        <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {{ loading ? '…' : pick('pending_approvals', 'pending_merchants', 'pending') }}
        </p>
      </Card>
      <Card title="Platform Revenue">
        <p class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {{ loading ? '…' : pick('platform_revenue', 'revenue', 'total_revenue') }}
        </p>
      </Card>
    </div>
  </div>
</template>
