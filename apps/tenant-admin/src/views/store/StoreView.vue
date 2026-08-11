<script setup lang="ts">
import StoreProfileView from './StoreProfileView.vue';
import StoreThemeView from './StoreThemeView.vue';
import StoreKycView from './StoreKycView.vue';
</script>

<template>
  <div class="flex flex-col gap-6">
    <StoreProfileView />
    <StoreThemeView />
    <StoreKycView />
  </div>
</template>
