<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@org/auth';
import { ApiError } from '@org/api-client';
import { TextInput, PasswordInput, Button, Card } from '@org/ui';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.registerUser({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    router.push('/');
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto flex max-w-sm flex-col gap-4 py-12">
    <Card title="Create an account">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="name" label="Full name" required />
        <TextInput v-model="email" type="email" label="Email" required />
        <PasswordInput v-model="password" label="Password" required />
        <PasswordInput v-model="passwordConfirmation" label="Confirm password" required />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="loading" class="w-full">Sign up</Button>
      </form>
      <p class="mt-4 text-center text-sm text-neutral-500">
        Already have an account? <RouterLink to="/login" class="font-medium text-primary-600">Sign in</RouterLink>
      </p>
    </Card>
  </div>
</template>
