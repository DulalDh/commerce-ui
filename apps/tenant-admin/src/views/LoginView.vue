<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@org/auth';
import { ApiError } from '@org/api-client';
import { TextInput, PasswordInput, Button, Card } from '@org/ui';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    const redirect = (route.query.redirect as string) || '/';
    router.push(redirect);
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-900">
    <Card title="Sign in to your store" class="w-full max-w-sm">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="email" type="email" label="Email" required placeholder="you@example.com" />
        <PasswordInput v-model="password" label="Password" required />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="loading" class="w-full">Sign in</Button>
      </form>
      <p class="mt-4 text-center text-sm text-neutral-500">
        Don't have a store yet?
        <RouterLink to="/register" class="font-medium text-primary-600">Register</RouterLink>
      </p>
    </Card>
  </div>
</template>
