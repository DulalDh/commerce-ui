<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { superAdminMenu, filterMenu, type MenuItem } from '@org/config';
import { useAuthStore, usePermission } from '@org/auth';
import { useTheme } from '@org/theme';
import { Button } from '@org/ui';

const route = useRoute();
const auth = useAuthStore();
const { can } = usePermission();
const { mode, toggleMode } = useTheme();

const menu = computed<MenuItem[]>(() => filterMenu(superAdminMenu as MenuItem[], { can }));

function isActive(item: MenuItem) {
  return item.route === route.path;
}

function onLogout() {
  auth.logout();
}
</script>

<template>
  <div class="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <aside class="w-64 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div class="px-4 py-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Commerge Platform
      </div>
      <nav class="flex flex-col gap-1 px-2">
        <template v-for="item in menu" :key="item.id">
          <RouterLink
            v-if="item.route"
            :to="item.route"
            class="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            :class="isActive(item) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : ''"
          >
            {{ item.label }}
          </RouterLink>
          <div v-else class="mt-2">
            <p class="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">{{ item.label }}</p>
            <RouterLink
              v-for="child in item.children"
              :key="child.id"
              :to="child.route!"
              class="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              :class="isActive(child) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : ''"
            >
              {{ child.label }}
            </RouterLink>
          </div>
        </template>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header class="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3 dark:border-neutral-700 dark:bg-neutral-800">
        <h1 class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {{ auth.user?.name ?? 'Super Admin' }}
        </h1>
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="sm" @click="toggleMode">
            {{ mode === 'dark' ? '☀️ Light' : '🌙 Dark' }}
          </Button>
          <Button variant="secondary" size="sm" @click="onLogout">Log out</Button>
        </div>
      </header>
      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
