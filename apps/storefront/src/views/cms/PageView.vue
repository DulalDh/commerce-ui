<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { cmsPublicService } from '@org/api-client';
import { Card } from '@org/ui';

interface Page {
  id: string | number;
  title: string;
  slug: string;
  content: string;
}

const route = useRoute();
const page = ref<Page | null>(null);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const pages = (await cmsPublicService.pages()) as unknown as Page[];
    page.value = pages.find((p) => p.slug === route.params.slug) ?? null;
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.slug, load);
onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <p v-else-if="!page" class="text-sm text-neutral-500">Page not found.</p>
  <Card v-else :title="page.title">
    <div class="prose max-w-none text-sm text-neutral-700 dark:text-neutral-200" v-html="page.content" />
  </Card>
</template>
