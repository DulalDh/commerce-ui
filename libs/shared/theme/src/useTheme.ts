import { ref, watchEffect } from 'vue';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'commerge-theme-mode';

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

const mode = ref<ThemeMode>(getInitialMode());

if (typeof document !== 'undefined') {
  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', mode.value);
    window.localStorage.setItem(STORAGE_KEY, mode.value);
  });
}

export function useTheme() {
  function setMode(next: ThemeMode) {
    mode.value = next;
  }

  function toggleMode() {
    mode.value = mode.value === 'light' ? 'dark' : 'light';
  }

  return { mode, setMode, toggleMode };
}
