<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { cmsPublicService } from '@org/api-client';
import { Card } from '@org/ui';

interface Faq {
  id: string | number;
  question: string;
  answer: string;
}

const faqs = ref<Faq[]>([]);
const loading = ref(true);
const openId = ref<string | number | null>(null);

function toggle(faq: Faq) {
  openId.value = openId.value === faq.id ? null : faq.id;
}

onMounted(async () => {
  loading.value = true;
  try {
    faqs.value = await cmsPublicService.faqs();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Card title="Frequently Asked Questions">
    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <p v-else-if="!faqs.length" class="text-sm text-neutral-500">No FAQs yet.</p>
    <div v-else class="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
      <div v-for="faq in faqs" :key="faq.id" class="py-3">
        <button
          class="w-full text-left text-sm font-medium text-neutral-900 dark:text-neutral-100"
          @click="toggle(faq)"
        >
          {{ faq.question }}
        </button>
        <p v-if="openId === faq.id" class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {{ faq.answer }}
        </p>
      </div>
    </div>
  </Card>
</template>
