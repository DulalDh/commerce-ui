<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { cmsPublicService, ApiError } from '@org/api-client';
import { Card } from '@org/ui';

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  published_at?: string;
}

const posts = ref<BlogPost[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    posts.value = await cmsPublicService.blogPosts();
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load posts';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Blog</h2>
    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <p v-else-if="error" class="text-sm text-danger-600">{{ error }}</p>
    <p v-else-if="!posts.length" class="text-sm text-neutral-500">No posts yet.</p>
    <div class="flex flex-col gap-3">
      <RouterLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`">
        <Card :title="post.title">
          <p v-if="post.excerpt" class="text-sm text-neutral-600 dark:text-neutral-300">{{ post.excerpt }}</p>
          <p v-if="post.published_at" class="mt-2 text-xs text-neutral-400">{{ post.published_at }}</p>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>
