<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reviewsService, ApiError } from '@org/api-client';
import { Card, Table, Badge, type TableColumn } from '@org/ui';

interface Review {
  id: string | number;
  quality_rating: number;
  behavior_rating: number;
  time_rating: number;
  communication_rating: number;
  comment?: string;
}

const reviews = ref<Review[]>([]);
const loading = ref(true);
const listError = ref('');

const columns: TableColumn[] = [
  { key: 'rating', label: 'Rating' },
  { key: 'comment', label: 'Comment' },
];

function average(review: Review) {
  return (
    (review.quality_rating + review.behavior_rating + review.time_rating + review.communication_rating) / 4
  ).toFixed(1);
}

async function load() {
  loading.value = true;
  listError.value = '';
  try {
    reviews.value = await reviewsService.list();
  } catch (err) {
    listError.value = err instanceof ApiError ? err.message : 'Failed to load reviews';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Card title="Reviews">
    <p v-if="listError" class="mb-3 text-sm text-danger-600">{{ listError }}</p>
    <Table :columns="columns" :rows="reviews as never" :loading="loading" row-key="id" empty-text="No reviews yet.">
      <template #cell-rating="{ row }">
        <Badge variant="success">★ {{ average(row as Review) }}</Badge>
      </template>
      <template #cell-comment="{ row }">{{ (row as Review).comment ?? '—' }}</template>
    </Table>
  </Card>
</template>
