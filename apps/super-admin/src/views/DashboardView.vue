<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { superAdminService } from '@org/api-client';
import { Card } from '@org/ui';

const stats = ref<Record<string, unknown>>({});
const loading = ref(true);

function pick(...keys: string[]) {
  for (const key of keys) {
    if (stats.value[key] !== undefined) return stats.value[key] as string | number;
  }
  return '—';
}

onMounted(async () => {
  loading.value = true;
  try {
    stats.value = await superAdminService.dashboard();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
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
</template>
