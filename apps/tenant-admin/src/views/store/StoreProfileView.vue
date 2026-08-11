<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { tenantsService, ApiError } from '@org/api-client';
import { Card, TextInput, Textarea, Button, Badge } from '@org/ui';

interface StoreStatus {
  status?: string;
  [key: string]: unknown;
}

const status = ref<StoreStatus | null>(null);
const loadingStatus = ref(true);

const profile = reactive({
  description: '',
  contact_email: '',
  address_line1: '',
  address_city: '',
  address_country: '',
});

const savingProfile = ref(false);
const profileError = ref('');
const profileSaved = ref(false);

async function loadStatus() {
  loadingStatus.value = true;
  try {
    status.value = await tenantsService.storeStatus();
  } catch {
    status.value = null;
  } finally {
    loadingStatus.value = false;
  }
}

async function onSaveProfile() {
  profileError.value = '';
  profileSaved.value = false;
  savingProfile.value = true;
  try {
    await tenantsService.updateProfile({
      description: profile.description,
      contact_email: profile.contact_email,
      address: {
        line1: profile.address_line1,
        city: profile.address_city,
        country: profile.address_country,
      },
    });
    profileSaved.value = true;
  } catch (err) {
    profileError.value = err instanceof ApiError ? err.message : 'Failed to save profile';
  } finally {
    savingProfile.value = false;
  }
}

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  approved: 'success',
  pending: 'warning',
  suspended: 'danger',
};

onMounted(loadStatus);
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card title="Store Status">
      <p v-if="loadingStatus" class="text-sm text-neutral-500">Loading…</p>
      <Badge v-else-if="status?.status" :variant="statusVariant[String(status.status)] ?? 'neutral'">
        {{ status.status }}
      </Badge>
      <p v-else class="text-sm text-neutral-500">Unable to load store status.</p>
    </Card>

    <Card title="Store Profile">
      <form class="flex flex-col gap-4" @submit.prevent="onSaveProfile">
        <Textarea v-model="profile.description" label="Description" rows="3" />
        <TextInput v-model="profile.contact_email" type="email" label="Contact email" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextInput v-model="profile.address_line1" label="Address line 1" />
          <TextInput v-model="profile.address_city" label="City" />
          <TextInput v-model="profile.address_country" label="Country" />
        </div>
        <p v-if="profileError" class="text-sm text-danger-600">{{ profileError }}</p>
        <p v-if="profileSaved" class="text-sm text-success-600">Saved.</p>
        <Button type="submit" :loading="savingProfile" class="w-fit">Save profile</Button>
      </form>
    </Card>
  </div>
</template>
