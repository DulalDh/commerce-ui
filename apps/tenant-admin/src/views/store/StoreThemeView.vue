<script setup lang="ts">
import { ref } from 'vue';
import { tenantsService, ApiError } from '@org/api-client';
import { Card, TextInput, Button, FileInput, ImagePreview } from '@org/ui';

const themeColor = ref('#3366ff');
const logoFile = ref<File | null>(null);
const bannerFile = ref<File | null>(null);
const logoPreview = ref('');
const bannerPreview = ref('');

const saving = ref(false);
const error = ref('');
const saved = ref(false);

function onLogoChange(files: FileList | null) {
  const file = files?.[0] ?? null;
  logoFile.value = file;
  logoPreview.value = file ? URL.createObjectURL(file) : '';
}

function onBannerChange(files: FileList | null) {
  const file = files?.[0] ?? null;
  bannerFile.value = file;
  bannerPreview.value = file ? URL.createObjectURL(file) : '';
}

async function onSubmit() {
  error.value = '';
  saved.value = false;
  saving.value = true;
  try {
    const formData = new FormData();
    formData.append('theme_color', themeColor.value);
    if (logoFile.value) formData.append('logo', logoFile.value);
    if (bannerFile.value) formData.append('banner', bannerFile.value);
    await tenantsService.updateTheme(formData);
    saved.value = true;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Failed to update theme';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Card title="Store Theme">
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <TextInput v-model="themeColor" label="Theme color" hint="Hex color, e.g. #3366FF" />

      <div class="flex flex-col gap-2">
        <FileInput label="Logo" accept="image/*" @change="onLogoChange" />
        <ImagePreview v-if="logoPreview" :src="logoPreview" alt="Logo preview" />
      </div>

      <div class="flex flex-col gap-2">
        <FileInput label="Banner" accept="image/*" @change="onBannerChange" />
        <ImagePreview v-if="bannerPreview" :src="bannerPreview" alt="Banner preview" />
      </div>

      <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
      <p v-if="saved" class="text-sm text-success-600">Theme updated.</p>
      <Button type="submit" :loading="saving" class="w-fit">Save theme</Button>
    </form>
  </Card>
</template>
