<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { subscriptionsService, plansService, ApiError } from '@org/api-client';
import { Card, Button, Badge } from '@org/ui';

interface Plan {
  id: string | number;
  name: string;
  price: number;
  limits?: Record<string, number>;
}

interface CurrentSubscription {
  plan?: Plan;
  status?: string;
}

const current = ref<CurrentSubscription | null>(null);
const plans = ref<Plan[]>([]);
const loading = ref(true);
const subscribingId = ref<string | number | null>(null);
const error = ref('');

async function load() {
  loading.value = true;
  try {
    const [currentSub, planList] = await Promise.all([
      subscriptionsService.current(),
      plansService.list(),
    ]);
    current.value = currentSub;
    plans.value = planList;
  } finally {
    loading.value = false;
  }
}

async function onSubscribe(plan: Plan) {
  error.value = '';
  subscribingId.value = plan.id;
  try {
    await subscriptionsService.subscribe({ plan_id: plan.id });
    await load();
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to subscribe';
  } finally {
    subscribingId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card title="Current plan">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <div v-else-if="current?.plan" class="flex items-center gap-3">
        <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ current.plan.name }}</span>
        <Badge variant="success">{{ current.status ?? 'active' }}</Badge>
      </div>
      <p v-else class="text-sm text-neutral-500">No active subscription.</p>
    </Card>

    <Card title="Available plans">
      <p v-if="error" class="mb-3 text-sm text-danger-600">{{ error }}</p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="flex flex-col gap-2 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
        >
          <p class="font-semibold text-neutral-900 dark:text-neutral-100">{{ plan.name }}</p>
          <p class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">${{ plan.price }}</p>
          <p v-if="plan.limits" class="text-xs text-neutral-500">
            {{ plan.limits.products ?? '∞' }} products · {{ plan.limits.staff ?? '∞' }} staff
          </p>
          <Button
            size="sm"
            :disabled="current?.plan?.id === plan.id"
            :loading="subscribingId === plan.id"
            @click="onSubscribe(plan)"
          >
            {{ current?.plan?.id === plan.id ? 'Current plan' : 'Subscribe' }}
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>
