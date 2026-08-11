<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { paymentsService, ApiError } from '@org/api-client';
import { Card, Select, Button } from '@org/ui';

const route = useRoute();
const router = useRouter();

const orderId = route.query.order_id as string;
const gateway = ref('cod');
const submitting = ref(false);
const error = ref('');
const result = ref<'completed' | 'pending' | null>(null);

const gatewayOptions = [
  { label: 'Cash on Delivery', value: 'cod' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'SSLCommerz', value: 'sslcommerz' },
  { label: 'bKash', value: 'bkash' },
  { label: 'Nagad', value: 'nagad' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'PayPal', value: 'paypal' },
];

async function onSubmit() {
  error.value = '';
  result.value = null;
  submitting.value = true;
  try {
    const payment = (await paymentsService.initiate({
      order_id: orderId,
      gateway: gateway.value,
    })) as unknown as { redirect_url?: string; status?: string };

    if (payment.redirect_url) {
      window.location.href = payment.redirect_url;
      return;
    }

    result.value = gateway.value === 'bank_transfer' ? 'pending' : 'completed';
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Payment failed';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-6">
    <Card title="Payment">
      <template v-if="!result">
        <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <Select v-model="gateway" label="Payment method" :options="gatewayOptions" />
          <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
          <Button type="submit" :loading="submitting" class="w-fit">Pay now</Button>
        </form>
      </template>

      <template v-else-if="result === 'completed'">
        <p class="text-sm text-success-600">Payment confirmed — your order is on its way!</p>
        <Button class="mt-4 w-fit" @click="router.push('/account/orders')">View my orders</Button>
      </template>

      <template v-else>
        <p class="text-sm text-warning-600">
          Order placed. Please complete the bank transfer; your order stays pending until we confirm payment.
        </p>
        <Button class="mt-4 w-fit" @click="router.push('/account/orders')">View my orders</Button>
      </template>
    </Card>
  </div>
</template>
