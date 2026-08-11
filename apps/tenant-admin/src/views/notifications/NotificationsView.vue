<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { notificationsService, ApiError } from '@org/api-client';
import { Card, Badge } from '@org/ui';

interface Notification {
  id: string | number;
  title?: string;
  message?: string;
  read_at?: string | null;
  created_at?: string;
}

const notifications = ref<Notification[]>([]);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    notifications.value = await notificationsService.list();
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to load notifications';
  } finally {
    loading.value = false;
  }
}

async function onMarkRead(notification: Notification) {
  if (notification.read_at) return;
  await notificationsService.markAsRead(notification.id);
  notification.read_at = new Date().toISOString();
}

onMounted(load);
</script>

<template>
  <Card title="Notifications">
    <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
    <p v-else-if="error" class="text-sm text-danger-600">{{ error }}</p>
    <p v-else-if="!notifications.length" class="text-sm text-neutral-500">No notifications yet.</p>
    <div v-else class="flex flex-col gap-2">
      <button
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-start justify-between rounded-md border p-3 text-left text-sm"
        :class="
          notification.read_at
            ? 'border-neutral-200 text-neutral-500 dark:border-neutral-700'
            : 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
        "
        @click="onMarkRead(notification)"
      >
        <div>
          <p class="font-medium text-neutral-900 dark:text-neutral-100">{{ notification.title ?? 'Notification' }}</p>
          <p v-if="notification.message">{{ notification.message }}</p>
        </div>
        <Badge v-if="!notification.read_at" variant="primary">New</Badge>
      </button>
    </div>
  </Card>
</template>
