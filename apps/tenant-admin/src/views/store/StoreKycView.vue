<script setup lang="ts">
import { ref } from 'vue';
import { tenantsService, ApiError } from '@org/api-client';
import { Card, Select, FileInput, Button } from '@org/ui';

const documentType = ref('business_license');
const documentFile = ref<File | null>(null);
const uploading = ref(false);
const error = ref('');
const uploaded = ref(false);

const typeOptions = [
  { label: 'Business License', value: 'business_license' },
  { label: 'Tax Certificate', value: 'tax_certificate' },
  { label: 'National ID', value: 'national_id' },
];

function onFileChange(files: FileList | null) {
  documentFile.value = files?.[0] ?? null;
}

async function onSubmit() {
  error.value = '';
  uploaded.value = false;
  if (!documentFile.value) {
    error.value = 'Please choose a document to upload.';
    return;
  }
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('type', documentType.value);
    formData.append('document', documentFile.value);
    await tenantsService.uploadKycDocument(formData);
    uploaded.value = true;
    documentFile.value = null;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to upload document';
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <Card title="KYC Documents">
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <Select v-model="documentType" label="Document type" :options="typeOptions" />
      <FileInput label="Document" accept="image/*,application/pdf" @change="onFileChange" />
      <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
      <p v-if="uploaded" class="text-sm text-success-600">Document uploaded.</p>
      <Button type="submit" :loading="uploading" class="w-fit">Upload</Button>
    </form>
  </Card>
</template>
