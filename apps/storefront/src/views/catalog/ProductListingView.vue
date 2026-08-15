<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsService, categoriesService, ApiError } from '@org/api-client';
import { getFeatureImageUrl, type ProductImage } from '@org/types';
import { Card, Select, Badge } from '@org/ui';

interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  images?: ProductImage[];
  flash_sale_discount_percentage?: number;
}

interface Category {
  id: string | number;
  name: string;
}

const route = useRoute();
const router = useRouter();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref('');

const categoryId = ref((route.query.category_id as string) ?? '');
const categoryOptions = computed(() => [
  { label: 'All categories', value: '' },
  ...categories.value.map((c) => ({ label: c.name, value: c.id })),
]);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const [productList, categoryList] = await Promise.all([
      productsService.list(categoryId.value ? { category_id: categoryId.value } : undefined),
      categories.value.length ? Promise.resolve(categories.value) : categoriesService.list(),
    ]);
    products.value = productList;
    categories.value = categoryList as Category[];
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load products';
  } finally {
    loading.value = false;
  }
}

watch(categoryId, (value) => {
  router.replace({ query: value ? { category_id: value } : {} });
  load();
});

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Shop</h2>
      <Select v-model="categoryId" :options="categoryOptions" class="w-56" />
    </div>

    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <p v-else-if="error" class="text-sm text-danger-600">{{ error }}</p>
    <p v-else-if="!products.length" class="text-sm text-neutral-500">No products found.</p>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <RouterLink v-for="product in products" :key="product.id" :to="`/products/${product.slug}`">
        <Card :padded="false" class="relative overflow-hidden">
          <Badge v-if="product.flash_sale_discount_percentage" variant="danger" class="absolute left-2 top-2 z-10">
            -{{ product.flash_sale_discount_percentage }}%
          </Badge>
          <img
            :src="getFeatureImageUrl(product.images, 'small')"
            :alt="product.name"
            loading="lazy"
            decoding="async"
            class="h-40 w-full object-cover"
          />
          <div class="p-3">
            <p class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ product.name }}</p>
            <p class="text-sm text-neutral-500">${{ product.price }}</p>
          </div>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
