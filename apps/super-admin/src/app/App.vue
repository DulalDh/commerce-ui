<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@org/auth';
import AppShell from './AppShell.vue';

const route = useRoute();
const auth = useAuthStore();

const isAuthLayout = computed(() => !auth.isAuthenticated || route.meta.requiresAuth === false);
</script>

<template>
  <AppShell v-if="!isAuthLayout" />
  <RouterView v-else />
</template>
