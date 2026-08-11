<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { servicesService, serviceCategoriesService, ApiError } from '@org/api-client';
import { Card, TextInput, Textarea, NumberInput, Select, Button } from '@org/ui';

const route = useRoute();
const router = useRouter();
const serviceId = computed(() => (route.params.id === 'new' ? null : (route.params.id as string)));

const form = reactive({
  name: '',
  slug: '',
  description: '',
  service_category_id: '',
  pricing_model: 'fixed',
  price: null as number | null,
  duration_minutes: null as number | null,
  service_area: '',
  required_equipment: '',
  cancellation_policy: '',
  status: 'draft',
});

const categoryOptions = ref<{ label: string; value: string | number }[]>([]);
const pricingModelOptions = [
  { label: 'Fixed price', value: 'fixed' },
  { label: 'Hourly rate', value: 'hourly' },
  { label: 'Quote on request', value: 'quote' },
];
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const loading = ref(true);
const saving = ref(false);
const error = ref('');

async function loadCategories() {
  const categories = await serviceCategoriesService.list() as unknown as { id: string | number; name: string }[];
  categoryOptions.value = categories.map((c) => ({ label: c.name, value: c.id }));
}

async function loadService() {
  if (!serviceId.value) return;
  const service = await servicesService.get(serviceId.value) as unknown as {
    name: string;
    slug: string;
    description?: string;
    service_category_id: string;
    pricing_model: string;
    price: number;
    duration_minutes: number;
    service_area?: string[];
    required_equipment?: string[];
    cancellation_policy?: string;
    status: string;
  };
  form.name = service.name;
  form.slug = service.slug;
  form.description = service.description ?? '';
  form.service_category_id = service.service_category_id;
  form.pricing_model = service.pricing_model;
  form.price = service.price;
  form.duration_minutes = service.duration_minutes;
  form.service_area = (service.service_area ?? []).join(', ');
  form.required_equipment = (service.required_equipment ?? []).join(', ');
  form.cancellation_policy = service.cancellation_policy ?? '';
  form.status = service.status;
}

async function onSubmit() {
  error.value = '';
  saving.value = true;
  try {
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      service_category_id: form.service_category_id || null,
      pricing_model: form.pricing_model,
      price: form.price,
      duration_minutes: form.duration_minutes,
      service_area: form.service_area.split(',').map((s) => s.trim()).filter(Boolean),
      required_equipment: form.required_equipment.split(',').map((s) => s.trim()).filter(Boolean),
      cancellation_policy: form.cancellation_policy,
      status: form.status,
    };
    if (serviceId.value) {
      await servicesService.update(serviceId.value, payload);
    } else {
      await servicesService.create(payload);
    }
    router.push('/services/listings');
  } catch (err) {
    if (err instanceof ApiError) {
      const fieldErrors = err.errors ? Object.values(err.errors).flat().join(' ') : '';
      error.value = fieldErrors || err.message;
    } else {
      error.value = 'Failed to save service';
    }
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    await loadCategories();
    await loadService();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Card :title="serviceId ? 'Edit service' : 'New service'">
    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <form v-else class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput v-model="form.name" label="Name" required />
        <TextInput v-model="form.slug" label="Slug" required />
        <Select v-model="form.service_category_id" label="Category" :options="categoryOptions" placeholder="Select category" />
        <Select v-model="form.status" label="Status" :options="statusOptions" />
        <Select v-model="form.pricing_model" label="Pricing model" :options="pricingModelOptions" />
        <NumberInput v-model="form.price" label="Price" required min="0" step="0.01" />
        <NumberInput v-model="form.duration_minutes" label="Duration (minutes)" min="0" />
      </div>

      <Textarea v-model="form.description" label="Description" rows="3" />
      <TextInput v-model="form.service_area" label="Service area" hint="Comma-separated cities, e.g. Dubai, Sharjah" />
      <TextInput v-model="form.required_equipment" label="Required equipment" hint="Comma-separated, e.g. vacuum, mop" />
      <Textarea v-model="form.cancellation_policy" label="Cancellation policy" rows="2" />

      <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
      <Button type="submit" :loading="saving" class="w-fit">Save service</Button>
    </form>
  </Card>
</template>
