<script lang="ts" setup>
import { useSidebarUi } from '../../model/useSidebarUi';
import { RouteList } from '../route-list';
import { CollapseButton } from './collapse-button';

const uiStore = useSidebarUi();
</script>

<template>
  <aside
    :class="[
      `sticky top-0 flex h-svh shrink-0 flex-col items-center justify-between self-start border-r border-border bg-bg-secondary px-2 py-4 transition-all duration-200`,
      uiStore.isCollapsed ? 'w-16' : 'w-40',
    ]"
  >
    <div :class="['flex flex-col items-center gap-2', !uiStore.isCollapsed && `w-full`]">
      <RouteList :is-expanded="!uiStore.isCollapsed" />
    </div>

    <CollapseButton />
  </aside>
</template>
