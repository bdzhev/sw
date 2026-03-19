<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import { useUser } from '@entities/user';

const { isLoggedIn } = useUser();

const redirectLink = computed(() => {
  return isLoggedIn.value ? '/app' : '/';
});
</script>

<template>
  <div class="p-8 text-center">
    <h1 class="text-4xl font-bold">404</h1>
    <p class="mt-2 text-lg">Oops! Page not found.</p>
    <RouterLink :to="redirectLink" class="mt-4 inline-block text-accent">
      Go back home
    </RouterLink>
  </div>
</template>
