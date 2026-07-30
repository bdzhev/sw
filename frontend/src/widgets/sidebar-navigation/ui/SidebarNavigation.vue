<script lang="ts" setup>
import { useBreakpoint } from '@shared/lib/ui';

import { MobileBar } from './mobile-bar';
import { SidebarRail } from './sidebar-rail';

/**
 * A rail and a drawer share no layout, so this is a switch rather than one tree
 * carrying both through `md:` prefixes — the same split the landing page's pain
 * section uses.
 */
const { isMobile } = useBreakpoint();
</script>

<template>
  <MobileBar v-if="isMobile" />

  <SidebarRail v-else />
</template>
