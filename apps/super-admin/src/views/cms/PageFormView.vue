<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pagesService, ApiError } from '@org/api-client';
import { Card, TextInput, Textarea, Select, Button } from '@org/ui';

interface PageVersion {
  id: string | number;
  created_at?: string;
  title?: string;
}

const route = useRoute();
const router = useRouter();
const pageId = computed(() => (route.params.id === 'new' ? null : (route.params.id as string)));

const form = reactive({ title: '', slug: '', content: '', status: 'draft' });
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const versions = ref<PageVersion[]>([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');

async function loadPage() {
  if (!pageId.value) return;
  const page = await pagesService.get(pageId.value) as unknown as {
    title: string;
    slug: string;
    content: string;
    status: string;
  };
  form.title = page.title;
  form.slug = page.slug;
  form.content = page.content;
  form.status = page.status;
  versions.value = await pagesService.versions(pageId.value);
}

async function onSubmit() {
  error.value = '';
  saving.value = true;
  try {
    if (pageId.value) {
      await pagesService.update(pageId.value, { ...form });
    } else {
      await pagesService.create({ ...form });
    }
    router.push('/cms/pages');
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to save page';
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    await loadPage();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card :title="pageId ? 'Edit page' : 'New page'">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.title" label="Title" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <Select v-model="form.status" label="Status" :options="statusOptions" />
        <Textarea v-model="form.content" label="Content (HTML)" rows="8" required />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save page</Button>
      </form>
    </Card>

    <Card v-if="pageId" title="Version History">
      <p v-if="!versions.length" class="text-sm text-neutral-500">No previous versions.</p>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="version in versions"
          :key="version.id"
          class="rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700"
        >
          <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ version.title ?? 'Version' }}</span>
          <span v-if="version.created_at" class="ml-2 text-xs text-neutral-500">{{ version.created_at }}</span>
        </div>
      </div>
    </Card>
  </div>
</template>
