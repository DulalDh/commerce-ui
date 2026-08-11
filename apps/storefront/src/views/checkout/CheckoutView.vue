<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { cartService, ApiError } from '@org/api-client';
import { Card, TextInput, Button } from '@org/ui';
import { useCartStore } from '../../stores/cart';

const cart = useCartStore();
const router = useRouter();

const address = reactive({ line1: '', city: '', country: '' });
const submitting = ref(false);
const error = ref('');

async function onSubmit() {
  error.value = '';
  submitting.value = true;
  try {
    const order = (await cartService.checkout({
      shipping_address: { ...address },
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
