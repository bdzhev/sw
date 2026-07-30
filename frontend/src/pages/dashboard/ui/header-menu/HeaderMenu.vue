<script setup lang="ts">
import { useBreakpoint } from '@shared/lib/ui';

import { DesktopHeader } from './desktop-header';
import { MobileHeader } from './mobile-header';

const { isMobile } = useBreakpoint();
</script>

<template>
  <MobileHeader v-if="isMobile" />

  <DesktopHeader v-else />
</template>
