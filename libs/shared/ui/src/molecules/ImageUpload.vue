<script setup lang="ts">
import { computed, ref } from 'vue';
import ImagePreview from './ImagePreview.vue';

export interface UploadedImage {
  id: string;
  url: string;
  file?: File;
  is_primary?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: UploadedImage[];
    label?: string;
    hint?: string;
    multiple?: boolean;
    accept?: string;
  }>(),
  { multiple: true, accept: 'image/*' },
);

const emit = defineEmits<{
  'update:modelValue': [images: UploadedImage[]];
  files: [files: File[]];
  remove: [image: UploadedImage];
  'set-primary': [image: UploadedImage];
}>();

const dragOver = ref(false);
const inputRef = ref<HTMLInputElement>();

const featureImage = computed(
  () => props.modelValue.find((img) => img.is_primary) ?? props.modelValue[0],
);
const otherImages = computed(() =>
  props.modelValue.filter((img) => img.id !== featureImage.value?.id),
);

function addFiles(fileList: FileList | null) {
  if (!fileList) return;
  const files = Array.from(fileList);
  const images: UploadedImage[] = files.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    url: URL.createObjectURL(file),
    file,
    is_primary: props.modelValue.length === 0 && index === 0,
  }));
  emit('update:modelValue', [...props.modelValue, ...images]);
  emit('files', files);
}

function onDrop(event: DragEvent) {
  dragOver.value = false;
  addFiles(event.dataTransfer?.files ?? null);
}

function removeImage(image: UploadedImage) {
  const next = props.modelValue.filter((img) => img.id !== image.id);
  if (image.is_primary && next.length) {
    next[0].is_primary = true;
  }
  emit('update:modelValue', next);
  emit('remove', image);
}

function setPrimary(image: UploadedImage) {
  const next = props.modelValue.map((img) => ({ ...img, is_primary: img.id === image.id }));
  emit('update:modelValue', next);
  emit('set-primary', image);
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <label v-if="label" class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
      {{ label }}
    </label>

    <div v-if="featureImage" class="flex flex-col gap-3 sm:flex-row sm:items-start">
      <ImagePreview
        :src="featureImage.url"
        primary
        removable
        size="lg"
        @remove="removeImage(featureImage)"
      />
      <div v-if="otherImages.length" class="flex flex-wrap gap-2">
        <ImagePreview
          v-for="img in otherImages"
          :key="img.id"
          :src="img.url"
          removable
          can-set-primary
          @remove="removeImage(img)"
          @set-primary="setPrimary(img)"
        />
      </div>
    </div>

    <div
      class="flex flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center text-sm transition-colors"
      :class="
        dragOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-neutral-300 dark:border-neutral-600'
      "
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <p class="text-neutral-500 dark:text-neutral-400">
        Drag & drop images here, or
        <button type="button" class="font-medium text-primary-600 dark:text-primary-400" @click="inputRef?.click()">
          browse
        </button>
      </p>
      <input
        ref="inputRef"
        type="file"
        class="hidden"
        :accept="accept"
        :multiple="multiple"
        @change="addFiles(($event.target as HTMLInputElement).files)"
      />
    </div>
    <p v-if="hint" class="text-xs text-neutral-500 dark:text-neutral-400">{{ hint }}</p>
  </div>
</template>
