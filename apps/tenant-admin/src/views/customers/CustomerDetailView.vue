<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { customersService, tagsService, ApiError } from '@org/api-client';
import { Card, Textarea, Button, Checkbox } from '@org/ui';

interface Customer {
  id: string | number;
  name: string;
  email: string;
  tags?: { id: string | number }[];
}

interface Note {
  id: string | number;
  note: string;
  created_at?: string;
}

interface Tag {
  id: string | number;
  name: string;
}

const route = useRoute();
const customerId = route.params.id as string;

const customer = ref<Customer | null>(null);
const notes = ref<Note[]>([]);
const tags = ref<Tag[]>([]);
const selectedTagIds = ref<Set<string | number>>(new Set());
const loading = ref(true);

const newNote = ref('');
const addingNote = ref(false);
const noteError = ref('');

const savingTags = ref(false);
const tagsError = ref('');
const tagsSaved = ref(false);

async function load() {
  loading.value = true;
  try {
    const [customerData, noteList, tagList] = await Promise.all([
      customersService.get(customerId),
      customersService.listNotes(customerId),
      tagsService.list(),
    ]);
    customer.value = customerData;
    notes.value = noteList;
    tags.value = tagList;
    selectedTagIds.value = new Set((customer.value?.tags ?? []).map((t) => t.id));
  } finally {
    loading.value = false;
  }
}

function toggleTag(id: string | number) {
  if (selectedTagIds.value.has(id)) selectedTagIds.value.delete(id);
  else selectedTagIds.value.add(id);
}

async function onAddNote() {
  if (!newNote.value.trim()) return;
  noteError.value = '';
  addingNote.value = true;
  try {
    await customersService.addNote(customerId, { note: newNote.value });
    newNote.value = '';
    notes.value = await customersService.listNotes(customerId);
  } catch (err) {
    noteError.value = err instanceof ApiError ? err.message : 'Failed to add note';
  } finally {
    addingNote.value = false;
  }
}

async function onSaveTags() {
  tagsError.value = '';
  tagsSaved.value = false;
  savingTags.value = true;
  try {
    await customersService.syncTags(customerId, Array.from(selectedTagIds.value));
    tagsSaved.value = true;
  } catch (err) {
    tagsError.value = err instanceof ApiError ? err.message : 'Failed to save tags';
  } finally {
    savingTags.value = false;
  }
}

onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-sm text-neutral-500">Loading…</p>
  <div v-else-if="customer" class="flex flex-col gap-6">
    <Card>
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ customer.name }}</h2>
      <p class="text-sm text-neutral-500">{{ customer.email }}</p>
    </Card>

    <Card title="Tags">
      <div class="flex flex-wrap gap-3">
        <Checkbox
          v-for="tag in tags"
          :key="tag.id"
          :model-value="selectedTagIds.has(tag.id)"
          :label="tag.name"
          @update:model-value="toggleTag(tag.id)"
        />
      </div>
      <p v-if="tagsError" class="mt-2 text-sm text-danger-600">{{ tagsError }}</p>
      <p v-if="tagsSaved" class="mt-2 text-sm text-success-600">Tags saved.</p>
      <Button class="mt-3 w-fit" :loading="savingTags" @click="onSaveTags">Save tags</Button>
    </Card>

    <Card title="Notes">
      <div class="flex flex-col gap-3">
        <div v-for="note in notes" :key="note.id" class="rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-700">
          {{ note.note }}
        </div>
        <p v-if="!notes.length" class="text-sm text-neutral-500">No notes yet.</p>

        <Textarea v-model="newNote" label="Add a note" rows="3" />
        <p v-if="noteError" class="text-sm text-danger-600">{{ noteError }}</p>
        <Button class="w-fit" :loading="addingNote" @click="onAddNote">Add note</Button>
      </div>
    </Card>
  </div>
</template>
