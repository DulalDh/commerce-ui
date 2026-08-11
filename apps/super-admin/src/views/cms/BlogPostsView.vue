<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { blogPostsService, ApiError } from '@org/api-client';
import { Card, Table, Button, Modal, TextInput, Textarea, Select, Badge, type TableColumn } from '@org/ui';

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  status: string;
}

const posts = ref<BlogPost[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
];

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const modalOpen = ref(false);
const editingId = ref<string | number | null>(null);
const form = reactive({ title: '', slug: '', excerpt: '', content: '', status: 'draft' });
const saving = ref(false);
const formError = ref('');

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    posts.value = await blogPostsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load blog posts';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.title = '';
  form.slug = '';
  form.excerpt = '';
  form.content = '';
  form.status = 'draft';
  formError.value = '';
  modalOpen.value = true;
}

async function openEdit(post: BlogPost) {
  editingId.value = post.id;
  const full = (await blogPostsService.get(post.id)) as unknown as {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: string;
  };
  form.title = full.title;
  form.slug = full.slug;
  form.excerpt = full.excerpt ?? '';
  form.content = full.content;
  form.status = full.status;
  formError.value = '';
  modalOpen.value = true;
}

async function onSubmit() {
  formError.value = '';
  saving.value = true;
  try {
    if (editingId.value) {
      await blogPostsService.update(editingId.value, { ...form });
    } else {
      await blogPostsService.create({ ...form });
    }
    modalOpen.value = false;
    await load();
  } catch (err) {
    formError.value = err instanceof ApiError ? err.message : 'Failed to save blog post';
  } finally {
    saving.value = false;
  }
}

async function onDelete(post: BlogPost) {
  if (!confirm(`Delete post "${post.title}"?`)) return;
  await blogPostsService.remove(post.id);
  await load();
}

onMounted(load);
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Blog Posts</h3>
        <Button size="sm" @click="openCreate">Add post</Button>
      </div>
    </template>

    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="posts as never" :loading="loading" row-key="id">
      <template #cell-status="{ row }">
        <Badge :variant="(row as BlogPost).status === 'published' ? 'success' : 'neutral'">{{ (row as BlogPost).status }}</Badge>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <button class="text-primary-600" @click="openEdit(row as BlogPost)">Edit</button>
          <button class="text-danger-600" @click="onDelete(row as BlogPost)">Delete</button>
        </div>
      </template>
    </Table>

    <Modal v-model="modalOpen" :title="editingId ? 'Edit post' : 'New post'" size="lg">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="form.title" label="Title" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <Select v-model="form.status" label="Status" :options="statusOptions" />
        <Textarea v-model="form.excerpt" label="Excerpt" rows="2" />
        <Textarea v-model="form.content" label="Content (HTML)" rows="6" required />
        <p v-if="formError" class="text-sm text-danger-600">{{ formError }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save</Button>
      </form>
    </Modal>
  </Card>
</template>
