<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import { RouteName } from '@shared/lib/router';

import { useUser } from '@entities/user';

const { isLoggedIn } = useUser();

const redirectLink = computed(() => {
  return isLoggedIn.value ? { name: RouteName.APP_HOME } : { name: RouteName.HOME };
});
</script>

<template>
  <div class="page-x py-12 text-center">
    <!-- No `text-4xl`: main.css already gives h1 a responsive scale, and a fixed
         size here pinned it to the desktop step on every screen. -->
    <h1>404</h1>

    <p class="mt-2 text-base md:text-lg">Oops! Page not found.</p>

    <RouterLink
      :to="redirectLink"
      class="mt-4 inline-flex min-h-11 items-center justify-center text-accent md:min-h-0"
    >
      Go back home
    </RouterLink>
  </div>
</template>
