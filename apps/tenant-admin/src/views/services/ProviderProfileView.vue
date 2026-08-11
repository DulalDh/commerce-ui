<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { providerService, ApiError } from '@org/api-client';
import { Card, NumberInput, TextInput, Button, FileInput } from '@org/ui';

const form = reactive({
  years_experience: null as number | null,
  cities: '',
  radius_km: null as number | null,
});

const loading = ref(true);
const saving = ref(false);
const error = ref('');
const saved = ref(false);

const certFile = ref<File | null>(null);
const uploadingCert = ref(false);
const certError = ref('');
const certUploaded = ref(false);

async function load() {
  loading.value = true;
  try {
    const profile = (await providerService.getProfile()) as unknown as {
      years_experience?: number;
      service_area?: { cities?: string[]; radius_km?: number };
    };
    form.years_experience = profile.years_experience ?? null;
    form.cities = (profile.service_area?.cities ?? []).join(', ');
    form.radius_km = profile.service_area?.radius_km ?? null;
  } finally {
    loading.value = false;
  }
}

async function onSave() {
  error.value = '';
  saved.value = false;
  saving.value = true;
  try {
    await providerService.updateProfile({
      years_experience: form.years_experience,
      service_area: {
        cities: form.cities.split(',').map((c) => c.trim()).filter(Boolean),
        radius_km: form.radius_km,
      },
    });
    saved.value = true;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to save profile';
  } finally {
    saving.value = false;
  }
}

function onCertChange(files: FileList | null) {
  certFile.value = files?.[0] ?? null;
}

async function onUploadCert() {
  if (!certFile.value) return;
  certError.value = '';
  certUploaded.value = false;
  uploadingCert.value = true;
  try {
    const fd = new FormData();
    fd.append('certificate', certFile.value);
    await providerService.uploadCertificate(fd);
    certUploaded.value = true;
    certFile.value = null;
  } catch (err) {
    certError.value = err instanceof ApiError ? err.message : 'Failed to upload certificate';
  } finally {
    uploadingCert.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card title="Provider Profile">
      <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
      <form v-else class="flex flex-col gap-4" @submit.prevent="onSave">
        <NumberInput v-model="form.years_experience" label="Years of experience" min="0" />
        <TextInput v-model="form.cities" label="Service cities" hint="Comma-separated, e.g. Dubai, Sharjah" />
        <NumberInput v-model="form.radius_km" label="Service radius (km)" min="0" />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <p v-if="saved" class="text-sm text-success-600">Saved.</p>
        <Button type="submit" :loading="saving" class="w-fit">Save profile</Button>
      </form>
    </Card>

    <Card title="Certificates">
      <form class="flex flex-col gap-4" @submit.prevent="onUploadCert">
        <FileInput label="Upload certificate" accept="image/*,application/pdf" @change="onCertChange" />
        <p v-if="certError" class="text-sm text-danger-600">{{ certError }}</p>
        <p v-if="certUploaded" class="text-sm text-success-600">Certificate uploaded.</p>
        <Button type="submit" :loading="uploadingCert" class="w-fit">Upload</Button>
      </form>
    </Card>
  </div>
</template>
