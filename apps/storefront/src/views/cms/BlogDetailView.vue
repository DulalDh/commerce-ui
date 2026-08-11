<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { cmsPublicService, ApiError } from '@org/api-client';
import { Card } from '@org/ui';

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  published_at?: string;
}

const route = useRoute();
const post = ref<BlogPost | null>(null);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const posts = (await cmsPublicService.blogPosts()) as unknown as BlogPost[];
    post.value = posts.find((p) => p.slug === route.params.slug) ?? null;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load post';
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.slug, load);
onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <p v-else-if="error" class="text-sm text-danger-600">{{ error }}</p>
  <p v-else-if="!post" class="text-sm text-neutral-500">Post not found.</p>
  <Card v-else :title="post.title">
    <p v-if="post.published_at" class="mb-3 text-xs text-neutral-400">{{ post.published_at }}</p>
    <div class="prose max-w-none text-sm text-neutral-700 dark:text-neutral-200" v-html="post.content" />
  </Card>
</template>
