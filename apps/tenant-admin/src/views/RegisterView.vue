<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@org/auth';
import { ApiError } from '@org/api-client';
import { TextInput, PasswordInput, Select, Button, Card } from '@org/ui';

const storeName = ref('');
const tenantType = ref<'merchant' | 'service_provider' | 'both'>('merchant');
const ownerName = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

const typeOptions = [
  { label: 'Product Merchant', value: 'merchant' },
  { label: 'Service Provider', value: 'service_provider' },
  { label: 'Both', value: 'both' },
];

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.registerTenant({
      tenant: { name: storeName.value, type: tenantType.value },
      owner: { name: ownerName.value, email: email.value, password: password.value },
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
  <div class="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-900">
    <Card title="Register your store" class="w-full max-w-sm">
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <TextInput v-model="storeName" label="Store name" required />
        <Select v-model="tenantType" label="Store type" :options="typeOptions" required />
        <TextInput v-model="ownerName" label="Your name" required />
        <TextInput v-model="email" type="email" label="Email" required />
        <PasswordInput v-model="password" label="Password" required />
        <p v-if="error" class="text-sm text-danger-600">{{ error }}</p>
        <Button type="submit" :loading="loading" class="w-full">Create store</Button>
      </form>
      <p class="mt-4 text-center text-sm text-neutral-500">
        Already have an account?
        <RouterLink to="/login" class="font-medium text-primary-600">Sign in</RouterLink>
      </p>
    </Card>
  </div>
</template>
