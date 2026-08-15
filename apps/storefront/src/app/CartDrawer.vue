<script setup lang="ts">
import { useRouter } from 'vue-router';
import { SidePanel, Button } from '@org/ui';
import { formatCurrency } from '@org/utils';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const router = useRouter();

function onCheckout() {
  cart.closeDrawer();
  router.push('/checkout');
}
</script>

<template>
  <SidePanel :model-value="cart.drawerOpen" title="Your cart" @update:model-value="cart.closeDrawer">
    <p v-if="cart.loading" class="text-sm text-neutral-500">Loading…</p>
    <p v-else-if="!cart.items.length" class="text-sm text-neutral-500">Your cart is empty.</p>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-700"
      >
        <div>
          <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ item.name }}</p>
          <p class="text-xs text-neutral-500">{{ formatCurrency(item.price) }} × {{ item.quantity }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded border border-neutral-300 px-2 text-sm dark:border-neutral-600"
            @click="cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))"
          >
            −
          </button>
          <span class="text-sm">{{ item.quantity }}</span>
          <button
            class="rounded border border-neutral-300 px-2 text-sm dark:border-neutral-600"
            @click="cart.updateQuantity(item.id, item.quantity + 1)"
          >
            +
          </button>
          <button class="text-xs text-danger-600" @click="cart.removeItem(item.id)">Remove</button>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Subtotal: {{ formatCurrency(cart.subtotal) }}
        </span>
        <Button :disabled="!cart.items.length" @click="onCheckout">Checkout</Button>
      </div>
    </template>
  </SidePanel>
</template>
