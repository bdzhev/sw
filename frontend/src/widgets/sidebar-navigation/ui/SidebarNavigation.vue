<script lang="ts" setup>
import { useSidebarUi } from '../model/useSidebarUi';

import { UserAvatar, CollapseButton, RouteList } from './components';

const uiStore = useSidebarUi();
</script>

<!-- prettier-ignore -->
<template>
  <aside :class="[`
    flex h-screen flex-col items-center justify-between border-r-border/50
    bg-bg-secondary px-2 py-4 transition-all duration-200
  `, uiStore.isCollapsed ? 'w-16': 'w-40']">
    <div :class="['flex flex-col items-center gap-2', !uiStore.isCollapsed && `
      w-full
    `]">
      <RouteList />
    </div>

    <div class="flex flex-col gap-2">
      <UserAvatar />

      <CollapseButton />
    </div>
  </aside>
</template>
