<script lang="ts" setup>
import { useSidebarUi } from '../model/useSidebarUi';

import { CollapseButton, RouteList } from './components';

const uiStore = useSidebarUi();
</script>

<template>
  <aside
    :class="[
      `
    flex h-screen flex-col items-center justify-between border-r-border/50
    bg-bg-secondary/50 px-2 py-4 transition-all duration-200
  `,
      uiStore.isCollapsed ? 'w-16' : 'w-40',
    ]"
  >
    <div
      :class="[
        'flex flex-col items-center gap-2',
        !uiStore.isCollapsed &&
          `
      w-full
    `,
      ]"
    >
      <RouteList />
    </div>

    <CollapseButton />
  </aside>
</template>
