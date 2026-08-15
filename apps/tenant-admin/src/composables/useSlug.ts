import { ref } from 'vue';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function useSlug(setSlug: (slug: string) => void) {
  const slugEditedManually = ref(false);

  function onNameInput(name: string) {
    if (!slugEditedManually.value) {
      setSlug(slugify(name));
    }
  }

  function onSlugInput() {
    slugEditedManually.value = true;
  }

  function reset(editing = false) {
    slugEditedManually.value = editing;
  }

  return { slugEditedManually, onNameInput, onSlugInput, reset };
}
