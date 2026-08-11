<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { storefrontMenu, filterMenu, type MenuItem } from '@org/config';
import { useAuthStore, usePermission } from '@org/auth';
import { useTheme } from '@org/theme';
import { Button, Badge } from '@org/ui';
import { useCartStore } from '../stores/cart';
import CartDrawer from './CartDrawer.vue';

const auth = useAuthStore();
const cart = useCartStore();
const { can } = usePermission();
const { mode, toggleMode } = useTheme();

const menu = computed<MenuItem[]>(() =>
  filterMenu(
    (storefrontMenu as MenuItem[]).filter((item) => item.id !== 'cart'),
    { can },
  ),
);
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <header class="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Commerge
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <template v-for="item in menu" :key="item.id">
            <RouterLink v-if="item.route" :to="item.route">{{ item.label }}</RouterLink>
          </template>
        </nav>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="toggleMode">
            {{ mode === 'dark' ? '☀️' : '🌙' }}
          </Button>
          <button class="relative flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-300" @click="cart.openDrawer">
            🛒
            <Badge v-if="cart.itemCount" variant="primary">{{ cart.itemCount }}</Badge>
          </button>
          <RouterLink v-if="!auth.isAuthenticated" to="/login" class="text-sm font-medium text-primary-600">
            Sign in
          </RouterLink>
          <Button v-else variant="secondary" size="sm" @click="auth.logout()">Log out</Button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-6">
      <RouterView />
    </main>
    <CartDrawer />
  </div>
</template>
