<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { servicesService, bookingsService, reviewsService, ApiError } from '@org/api-client';
import { Card, TextInput, DatePicker, Button, Badge } from '@org/ui';
import { formatCurrency } from '@org/utils';

interface Service {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  pricing_model: string;
  duration_minutes?: number;
  cancellation_policy?: string;
}

interface Review {
  id: string | number;
  quality_rating: number;
  behavior_rating: number;
  time_rating: number;
  communication_rating: number;
  comment?: string;
}

const route = useRoute();
const router = useRouter();

const service = ref<Service | null>(null);
const reviews = ref<Review[]>([]);
const loading = ref(true);

function averageRating(review: Review) {
  return (
    (review.quality_rating + review.behavior_rating + review.time_rating + review.communication_rating) / 4
  ).toFixed(1);
}

const form = reactive({
  scheduled_date: '',
  scheduled_slot_start: '09:00',
  scheduled_slot_end: '11:00',
  line1: '',
  city: '',
  notes: '',
});

const booking = ref(false);
const error = ref('');
const bookingId = ref<string | number | null>(null);

async function load() {
  loading.value = true;
  try {
    service.value = await servicesService.get(route.params.slug as string);
    if (service.value) {
      reviews.value = await reviewsService.list({ service_id: service.value.id });
    }
  } finally {
    loading.value = false;
  }
}

async function onBook() {
  if (!service.value) return;
  error.value = '';
  booking.value = true;
  try {
    const created = (await bookingsService.create({
      service_id: service.value.id,
      scheduled_date: form.scheduled_date,
      scheduled_slot_start: form.scheduled_slot_start,
      scheduled_slot_end: form.scheduled_slot_end,
      address: { line1: form.line1, city: form.city },
      is_emergency: false,
      notes: form.notes,
    })) as unknown as { id: string | number };
    bookingId.value = created.id;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to create booking';
  } finally {
    booking.value = false;
  }
}
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <div v-else-if="service" class="grid grid-cols-1 gap-8 sm:grid-cols-2">
    <Card>
      <h1 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{{ service.name }}</h1>
      <p class="mt-2 text-lg text-neutral-700 dark:text-neutral-200">
        {{ formatCurrency(service.price) }}<span v-if="service.pricing_model === 'hourly'">/hr</span>
      </p>
      <p v-if="service.duration_minutes" class="mt-1 text-sm text-neutral-500">
        Duration: {{ service.duration_minutes }} minutes
      </p>
      <p v-if="service.description" class="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
        {{ service.description }}
      </p>
      <p v-if="service.cancellation_policy" class="mt-3 text-xs text-neutral-400">
        {{ service.cancellation_policy }}
      </p>
    </Card>

    <Card title="Book this service">
      <template v-if="bookingId">
        <p class="text-sm text-success-600">Booking confirmed! Reference #{{ bookingId }}.</p>
        <Button class="mt-4 w-fit" @click="router.push('/account/bookings')">View my bookings</Button>
      </template>

      <form v-else class="flex flex-col gap-4" @submit.prevent="onBook">
        <DatePicker v-model="form.scheduled_date" label="Date" required />
        <div class="grid grid-cols-2 gap-4">
          <DatePicker v-model="form.scheduled_slot_start" type="time" label="Start time" required />
          <DatePicker v-model="form.scheduled_slot_end" type="time" label="End time" required />
        </div>
        <TextInput v-model="form.line1" label="Address line 1" required />
        <TextInput v-model="form.city" label="City" required />
        <TextInput v-model="form.notes" label="Notes (optional)" />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="booking" class="w-fit">Confirm booking</Button>
      </form>
    </Card>

    <Card title="Reviews" class="sm:col-span-2">
      <p v-if="!reviews.length" class="text-sm text-neutral-500">No reviews yet.</p>
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-700"
        >
          <div class="flex items-center gap-2">
            <Badge variant="success">★ {{ averageRating(review) }}</Badge>
          </div>
          <p v-if="review.comment" class="mt-2 text-neutral-600 dark:text-neutral-300">{{ review.comment }}</p>
        </div>
      </div>
    </Card>
  </div>
</template>
