<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { productsService, ApiError } from '@org/api-client';
import { getFeatureImage, getImageVariant, type ProductImage } from '@org/types';
import { formatCurrency } from '@org/utils';
import { Card, Button, ImagePreview, Select, Badge } from '@org/ui';
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
  images?: ProductImage[];
  variants?: Variant[];
  flash_sale_discount_percentage?: number;
}

const route = useRoute();
const cart = useCartStore();
const product = ref<Product | null>(null);
const loading = ref(true);
const selectedVariantId = ref('');
const adding = ref(false);
const addError = ref('');
const added = ref(false);

const featureImage = computed(() => getFeatureImage(product.value?.images));
const otherImages = computed(() =>
  (product.value?.images ?? []).filter((img) => img.id !== featureImage.value?.id),
);

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
    <div class="flex flex-col gap-2">
      <ImagePreview
        v-if="featureImage"
        :src="getImageVariant(featureImage, 'large')"
        primary
        size="lg"
      />
      <p v-else class="text-sm text-neutral-500">No images</p>
      <div v-if="otherImages.length" class="flex flex-wrap gap-2">
        <ImagePreview
          v-for="img in otherImages"
          :key="img.id"
          :src="getImageVariant(img, 'thumbnail')"
        />
      </div>
    </div>

    <Card>
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{{ product.name }}</h1>
        <Badge v-if="product.flash_sale_discount_percentage" variant="danger">
          -{{ product.flash_sale_discount_percentage }}% flash sale
        </Badge>
      </div>
      <p class="mt-2 text-lg text-neutral-700 dark:text-neutral-200">{{ formatCurrency(product.price) }}</p>
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
