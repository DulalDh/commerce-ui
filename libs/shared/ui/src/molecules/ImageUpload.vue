<script setup lang="ts">
import { ref } from 'vue';
import ImagePreview from './ImagePreview.vue';

export interface UploadedImage {
  id: string;
  url: string;
  file?: File;
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
}>();

const dragOver = ref(false);
const inputRef = ref<HTMLInputElement>();

function addFiles(fileList: FileList | null) {
  if (!fileList) return;
  const files = Array.from(fileList);
  const images: UploadedImage[] = files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    url: URL.createObjectURL(file),
    file,
  }));
  emit('update:modelValue', [...props.modelValue, ...images]);
  emit('files', files);
}

function onDrop(event: DragEvent) {
  dragOver.value = false;
  addFiles(event.dataTransfer?.files ?? null);
}

function removeAt(index: number) {
  const next = [...props.modelValue];
  next.splice(index, 1);
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
      {{ label }}
    </label>
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
    <div v-if="modelValue.length" class="flex flex-wrap gap-2">
      <ImagePreview
        v-for="(img, i) in modelValue"
        :key="img.id"
        :src="img.url"
        removable
        @remove="removeAt(i)"
      />
    </div>
  </div>
</template>
