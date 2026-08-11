<script setup lang="ts">
import { reactive, ref } from 'vue';
import { reviewsService, ApiError } from '@org/api-client';
import { Modal, NumberInput, Textarea, Button } from '@org/ui';

const props = defineProps<{
  modelValue: boolean;
  bookingId: string | number | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submitted: [];
}>();

const form = reactive({
  quality_rating: 5,
  behavior_rating: 5,
  time_rating: 5,
  communication_rating: 5,
  comment: '',
});

const submitting = ref(false);
const error = ref('');

async function onSubmit() {
  if (!props.bookingId) return;
  error.value = '';
  submitting.value = true;
  try {
    await reviewsService.createForBooking(props.bookingId, { ...form });
    emit('submitted');
    emit('update:modelValue', false);
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to submit review';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Modal :model-value="modelValue" title="Rate your experience" @update:model-value="emit('update:modelValue', $event)">
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <NumberInput v-model="form.quality_rating" label="Quality (1-5)" min="1" max="5" required />
      <NumberInput v-model="form.behavior_rating" label="Behavior (1-5)" min="1" max="5" required />
      <NumberInput v-model="form.time_rating" label="Punctuality (1-5)" min="1" max="5" required />
      <NumberInput v-model="form.communication_rating" label="Communication (1-5)" min="1" max="5" required />
      <Textarea v-model="form.comment" label="Comment" rows="3" />
      <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
      <Button type="submit" :loading="submitting" class="w-fit">Submit review</Button>
    </form>
  </Modal>
</template>
