<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsService, categoriesService } from '@org/api-client';
import { Card, Select } from '@org/ui';

interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  images?: { url: string }[];
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

const categoryId = ref((route.query.category_id as string) ?? '');
const categoryOptions = computed(() => [
  { label: 'All categories', value: '' },
  ...categories.value.map((c) => ({ label: c.name, value: c.id })),
]);

async function load() {
  loading.value = true;
  try {
    const [productList, categoryList] = await Promise.all([
      productsService.list(categoryId.value ? { category_id: categoryId.value } : undefined),
      categories.value.length ? Promise.resolve(categories.value) : categoriesService.list(),
    ]);
    products.value = productList;
    categories.value = categoryList as Category[];
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
    <p v-else-if="!products.length" class="text-sm text-neutral-500">No products found.</p>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <RouterLink v-for="product in products" :key="product.id" :to="`/products/${product.slug}`">
        <Card :padded="false" class="overflow-hidden">
          <img
            v-if="product.images?.[0]"
            :src="product.images[0].url"
            :alt="product.name"
            class="h-40 w-full object-cover"
          />
          <div v-else class="flex h-40 w-full items-center justify-center bg-neutral-100 text-neutral-400 dark:bg-neutral-700">
            No image
          </div>
          <div class="p-3">
            <p class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ product.name }}</p>
            <p class="text-sm text-neutral-500">${{ product.price }}</p>
          </div>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
