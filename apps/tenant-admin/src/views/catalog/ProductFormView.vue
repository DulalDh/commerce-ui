<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  productsService,
  categoriesService,
  brandsService,
  tagsService,
  ApiError,
} from '@org/api-client';
import type { UploadedImage } from '@org/ui';
import {
  Card,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  Button,
  ImageUpload,
} from '@org/ui';

interface Option {
  label: string;
  value: string | number;
}

interface Variant {
  id?: string | number;
  name: string;
  price: number | null;
  attributes: string;
}

const route = useRoute();
const router = useRouter();
const productId = computed(() => (route.params.id === 'new' ? null : (route.params.id as string)));

const form = reactive({
  name: '',
  slug: '',
  price: null as number | null,
  category_id: '',
  brand_id: '',
  status: 'draft',
});

const categoryOptions = ref<Option[]>([]);
const brandOptions = ref<Option[]>([]);
const tagOptions = ref<Option[]>([]);
const selectedTagIds = ref<Set<string | number>>(new Set());

const images = ref<UploadedImage[]>([]);
const pendingImageFiles = ref<File[]>([]);
const variants = ref<Variant[]>([]);
const newVariant = reactive<Variant>({ name: '', price: null, attributes: '' });

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const loading = ref(true);
const saving = ref(false);
const error = ref('');

function onImageFiles(files: File[]) {
  pendingImageFiles.value.push(...files);
}

function toggleTag(id: string | number) {
  if (selectedTagIds.value.has(id)) selectedTagIds.value.delete(id);
  else selectedTagIds.value.add(id);
}

async function loadOptions() {
  const [categories, brands, tags] = await Promise.all([
    categoriesService.list(),
    brandsService.list(),
    tagsService.list(),
  ]);
  categoryOptions.value = (categories as Option[]).map((c) => ({ label: c.label ?? (c as unknown as { name: string }).name, value: c.value ?? (c as unknown as { id: string }).id }));
  brandOptions.value = (brands as unknown as { id: string; name: string }[]).map((b) => ({ label: b.name, value: b.id }));
  tagOptions.value = (tags as unknown as { id: string; name: string }[]).map((t) => ({ label: t.name, value: t.id }));
}

async function loadProduct() {
  if (!productId.value) return;
  const product = await productsService.get(productId.value) as unknown as {
    name: string;
    slug: string;
    price: number;
    category_id: string;
    brand_id: string;
    status: string;
    tags?: { id: string | number }[];
    images?: { id: string; url: string }[];
    variants?: Variant[];
  };
  form.name = product.name;
  form.slug = product.slug;
  form.price = product.price;
  form.category_id = product.category_id;
  form.brand_id = product.brand_id;
  form.status = product.status;
  selectedTagIds.value = new Set((product.tags ?? []).map((t) => t.id));
  images.value = (product.images ?? []).map((img) => ({ id: String(img.id), url: img.url }));
  variants.value = product.variants ?? [];
}

async function onSubmit() {
  error.value = '';
  saving.value = true;
  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      price: form.price,
      category_id: form.category_id,
      brand_id: form.brand_id,
      status: form.status,
      tag_ids: Array.from(selectedTagIds.value),
    };

    const saved = productId.value
      ? await productsService.update(productId.value, payload)
      : await productsService.create(payload);

    const savedId = (saved as unknown as { id: string | number }).id;

    for (const file of pendingImageFiles.value) {
      const fd = new FormData();
      fd.append('image', file);
      await productsService.uploadImage(savedId, fd);
    }
    pendingImageFiles.value = [];

    router.push('/catalog/products');
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to save product';
  } finally {
    saving.value = false;
  }
}

async function onAddVariant() {
  if (!productId.value || !newVariant.name) return;
  let attributes: Record<string, unknown> = {};
  try {
    attributes = newVariant.attributes ? JSON.parse(newVariant.attributes) : {};
  } catch {
    error.value = 'Variant attributes must be valid JSON, e.g. {"color":"red"}';
    return;
  }
  const created = await productsService.addVariant(productId.value, {
    name: newVariant.name,
    price: newVariant.price,
    attributes,
  });
  variants.value.push(created as unknown as Variant);
  newVariant.name = '';
  newVariant.price = null;
  newVariant.attributes = '';
}

async function onRemoveVariant(variant: Variant) {
  if (!productId.value || !variant.id) return;
  await productsService.deleteVariant(productId.value, variant.id);
  variants.value = variants.value.filter((v) => v.id !== variant.id);
}

onMounted(async () => {
  loading.value = true;
  try {
    await loadOptions();
    await loadProduct();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card :title="productId ? 'Edit product' : 'New product'">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput v-model="form.name" label="Name" required />
          <TextInput v-model="form.slug" label="Slug" required />
          <NumberInput v-model="form.price" label="Price" required min="0" step="0.01" />
          <Select v-model="form.status" label="Status" :options="statusOptions" />
          <Select v-model="form.category_id" label="Category" :options="categoryOptions" placeholder="Select category" />
          <Select v-model="form.brand_id" label="Brand" :options="brandOptions" placeholder="Select brand" />
        </div>

        <div>
          <p class="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">Tags</p>
          <div class="flex flex-wrap gap-3">
            <Checkbox
              v-for="tag in tagOptions"
              :key="tag.value"
              :model-value="selectedTagIds.has(tag.value)"
              :label="tag.label"
              @update:model-value="toggleTag(tag.value)"
            />
          </div>
        </div>

        <ImageUpload v-model="images" label="Product images" @files="onImageFiles" />

        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="saving" class="w-fit">Save product</Button>
      </form>
    </Card>

    <Card v-if="productId" title="Variants">
      <div class="flex flex-col gap-3">
        <div v-for="variant in variants" :key="variant.id" class="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
          <span>{{ variant.name }} — ${{ variant.price }}</span>
          <button class="text-danger-600" @click="onRemoveVariant(variant)">Remove</button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
          <TextInput v-model="newVariant.name" label="Variant name" />
          <NumberInput v-model="newVariant.price" label="Price" min="0" step="0.01" />
          <TextInput v-model="newVariant.attributes" label="Attributes (JSON)" placeholder='{"color":"red"}' />
          <Button variant="secondary" @click="onAddVariant">Add variant</Button>
        </div>
      </div>
    </Card>
  </div>
</template>
