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
  <div class="mx-auto flex max-w-sm flex-col gap-4 py-12">
    <Card title="Sign in">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="email" type="email" label="Email" required />
        <PasswordInput v-model="password" label="Password" required />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="loading" class="w-full">Sign in</Button>
      </form>
      <p class="mt-4 text-center text-sm text-neutral-500">
        New here? <RouterLink to="/register" class="font-medium text-primary-600">Create an account</RouterLink>
      </p>
    </Card>
  </div>
</template>
