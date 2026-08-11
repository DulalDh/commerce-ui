<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { productsService, ApiError } from '@org/api-client';
import { Card, Button, ImagePreview, Select } from '@org/ui';
import { useCartStore } from '../../stores/cart';

interface Variant {
  id: string | number;
  name: string;
  price: number;
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  images?: { url: string }[];
  variants?: Variant[];
}

const route = useRoute();
const cart = useCartStore();
const product = ref<Product | null>(null);
const loading = ref(true);
const selectedVariantId = ref('');
const adding = ref(false);
const addError = ref('');
const added = ref(false);

async function load() {
  loading.value = true;
  try {
    product.value = await productsService.get(route.params.slug as string);
  } finally {
    loading.value = false;
  }
}

async function onAddToCart() {
  if (!product.value) return;
  addError.value = '';
  added.value = false;
  adding.value = true;
  try {
    await cart.addItem({
      product_id: product.value.id,
      variant_id: selectedVariantId.value || undefined,
      quantity: 1,
    });
    added.value = true;
    cart.openDrawer();
  } catch (err) {
    addError.value = err instanceof ApiError ? err.message : 'Failed to add to cart';
  } finally {
    adding.value = false;
  }
}

onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <div v-else-if="product" class="grid grid-cols-1 gap-8 sm:grid-cols-2">
    <div class="flex flex-wrap gap-2">
      <ImagePreview v-for="(img, i) in product.images ?? []" :key="i" :src="img.url" class="h-40 w-40" />
      <p v-if="!product.images?.length" class="text-sm text-neutral-500">No images</p>
    </div>

    <Card>
      <h1 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{{ product.name }}</h1>
      <p class="mt-2 text-lg text-neutral-700 dark:text-neutral-200">${{ product.price }}</p>
      <p v-if="product.description" class="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
        {{ product.description }}
      </p>

      <Select
        v-if="product.variants?.length"
        v-model="selectedVariantId"
        label="Variant"
        class="mt-4"
        :options="product.variants.map((v) => ({ label: `${v.name} — $${v.price}`, value: v.id }))"
        placeholder="Choose a variant"
      />

      <p v-if="addError" class="mt-3 text-sm text-danger-600">{{ addError }}</p>
      <p v-if="added" class="mt-3 text-sm text-success-600">Added to cart.</p>
      <Button class="mt-4" :loading="adding" @click="onAddToCart">Add to cart</Button>
    </Card>
  </div>
</template>
