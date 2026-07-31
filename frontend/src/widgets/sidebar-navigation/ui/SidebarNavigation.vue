<script lang="ts" setup>
import { useBreakpoint } from '@shared/lib/ui';

import { SidebarRail } from './sidebar-rail';

/**
 * Desktop only. Below md the navigation is a burger and a drawer, and those live
 * in each page's own mobile header via MobileNavHeader — a page needs to put its
 * actions next to the burger, and App.vue renders this once for every route.
 */
const { isMobile } = useBreakpoint();
</script>

<template>
  <SidebarRail v-if="!isMobile" />
</template>
