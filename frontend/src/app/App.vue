<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { LandingFooter } from '@widgets/landing-footer';
import { LandingHeader } from '@widgets/landing-header';
import { SidebarNavigation } from '@widgets/sidebar-navigation';

const route = useRoute();

const layout = computed(() => route.meta.layout);
</script>

<template>
  <component :is="layout">
    <template v-slot:header>
      <LandingHeader />
    </template>

    <template v-slot:navigation>
      <SidebarNavigation />
    </template>

    <template v-slot:default>
      <router-view />
    </template>

    <template v-slot:footer>
      <LandingFooter />
    </template>
  </component>
</template>

<style>
@import '../main.css';
</style>
