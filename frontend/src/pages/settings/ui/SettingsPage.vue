<script setup lang="ts">
import { useBreakpoint } from '@shared/lib/ui';

import { MobileNavHeader } from '@widgets/sidebar-navigation';

// import { useUser } from '@entities/user';

// const user = useUser();

const { isMobile } = useBreakpoint();
</script>

<template>
  <MobileNavHeader v-if="isMobile" />

  <div>account settings</div>
</template>
