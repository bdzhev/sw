<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { Toaster } from '@shared/ui/toast';
import { TooltipProvider } from '@shared/ui/tooltip';

import { LandingFooter } from '@widgets/landing-footer';
import { LandingHeader } from '@widgets/landing-header';
import { SidebarNavigation } from '@widgets/sidebar-navigation';

const route = useRoute();

/** reka defaults to 700ms, which reads as "the tooltip is broken". */
const TOOLTIP_DELAY_MS = 200;

const layout = computed(() => {
  return route.meta.layout;
});
</script>

<template>
  <TooltipProvider :delay-duration="TOOLTIP_DELAY_MS">
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

    <Toaster />
  </TooltipProvider>
</template>

<style>
@import '../main.css';
</style>
