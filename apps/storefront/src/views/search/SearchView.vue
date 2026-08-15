<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marketplaceService } from '@org/api-client';
import { Card, TextInput, Select, Badge } from '@org/ui';
import { formatCurrency } from '@org/utils';

interface SearchResult {
  id: string | number;
  name: string;
  slug?: string;
  type: 'product' | 'service';
  price?: number;
}

const route = useRoute();
const router = useRouter();

const query = ref((route.query.q as string) ?? '');
const type = ref((route.query.type as string) ?? '');
const results = ref<SearchResult[]>([]);
const loading = ref(false);

const typeOptions = [
  { label: 'All', value: '' },
  { label: 'Products', value: 'product' },
  { label: 'Services', value: 'service' },
];

async function search() {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  loading.value = true;
  try {
    results.value = await marketplaceService.search({
      q: query.value,
      type: (type.value || undefined) as 'product' | 'service' | undefined,
    });
  } finally {
    loading.value = false;
  }
}

function detailRoute(result: SearchResult) {
  return result.type === 'product' ? `/products/${result.slug ?? result.id}` : `/services/${result.slug ?? result.id}`;
}

let debounceTimer: ReturnType<typeof setTimeout>;
watch([query, type], () => {
  router.replace({ query: { q: query.value || undefined, type: type.value || undefined } });
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(search, 300);
});

search();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-3">
      <TextInput v-model="query" placeholder="Search products and services…" class="flex-1" />
      <Select v-model="type" :options="typeOptions" class="w-40" />
    </div>

    <p v-if="loading" class="text-sm text-neutral-500">Searching…</p>
    <p v-else-if="query && !results.length" class="text-sm text-neutral-500">No results for "{{ query }}".</p>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <RouterLink v-for="result in results" :key="`${result.type}-${result.id}`" :to="detailRoute(result)">
        <Card>
          <div class="flex items-center justify-between">
            <p class="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ result.name }}</p>
            <Badge variant="neutral">{{ result.type }}</Badge>
          </div>
          <p v-if="result.price" class="mt-1 text-sm text-neutral-500">{{ formatCurrency(result.price) }}</p>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
