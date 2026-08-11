<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { cartService, shippingService, ApiError } from '@org/api-client';
import { Card, TextInput, Select, Button } from '@org/ui';
import { useCartStore } from '../../stores/cart';

const cart = useCartStore();
const router = useRouter();

const address = reactive({ line1: '', city: '', country: '' });
const couponCode = ref('');
const submitting = ref(false);
const error = ref('');

const origin = ref('Dhaka');
const provider = ref('pathao');
const shippingRate = ref<number | null>(null);
const shippingError = ref('');
const calculatingRate = ref(false);

const providerOptions = [{ label: 'Pathao', value: 'pathao' }];

async function calculateRate() {
  if (!address.city) return;
  shippingError.value = '';
  calculatingRate.value = true;
  try {
    const result = (await shippingService.calculateRate({
      provider: provider.value,
      origin: origin.value,
      destination: address.city,
      weight_kg: cart.items.reduce((sum, item) => sum + item.quantity * 0.5, 0.5),
    })) as unknown as { rate?: number; amount?: number };
    shippingRate.value = result.rate ?? result.amount ?? null;
  } catch (err) {
    shippingError.value = err instanceof ApiError ? err.message : 'Failed to calculate shipping';
    shippingRate.value = null;
  } finally {
    calculatingRate.value = false;
  }
}

let debounceTimer: ReturnType<typeof setTimeout>;
watch(() => address.city, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(calculateRate, 400);
});

async function onSubmit() {
  error.value = '';
  submitting.value = true;
  try {
    const order = (await cartService.checkout({
      shipping_address: { ...address },
      coupon_code: couponCode.value || undefined,
    })) as unknown as { id: string | number };
    await cart.refresh();
    router.push(`/checkout/payment?order_id=${order.id}`);
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Checkout failed';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-lg flex-col gap-6">
    <Card title="Shipping address">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="address.line1" label="Address line 1" required />
        <TextInput v-model="address.city" label="City" required />
        <TextInput v-model="address.country" label="Country" required />

        <div class="flex items-end gap-3">
          <Select v-model="provider" label="Carrier" :options="providerOptions" class="flex-1" />
          <Button type="button" variant="secondary" :loading="calculatingRate" @click="calculateRate">
            Estimate shipping
          </Button>
        </div>
        <p v-if="shippingError" class="text-sm text-danger-600">{{ shippingError }}</p>
        <p v-else-if="shippingRate !== null" class="text-sm text-neutral-600 dark:text-neutral-300">
          Estimated shipping: ${{ shippingRate.toFixed(2) }}
        </p>

        <TextInput v-model="couponCode" label="Coupon code (optional)" placeholder="e.g. SAVE20" />

        <div class="flex items-center justify-between border-t border-neutral-200 pt-4 text-sm dark:border-neutral-700">
          <span class="font-medium text-neutral-700 dark:text-neutral-200">
            Subtotal: ${{ cart.subtotal.toFixed(2) }}
          </span>
        </div>

        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="submitting" :disabled="!cart.items.length" class="w-fit">
          Place order
        </Button>
      </form>
    </Card>
  </div>
</template>
