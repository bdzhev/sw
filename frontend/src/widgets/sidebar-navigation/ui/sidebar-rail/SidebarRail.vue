<script lang="ts" setup>
import { useSidebarUi } from '../../model/useSidebarUi';
import { RouteList } from '../route-list';
import { CollapseButton } from './collapse-button';

const uiStore = useSidebarUi();
</script>

<template>
  <!-- Only ever rendered from md up, so it carries no responsive prefixes. -->
  <aside
    :class="[
      `flex h-[100svh] flex-col items-center justify-between border-r-border/50 bg-bg-secondary/50 px-2 py-4 transition-all duration-200`,
      uiStore.isCollapsed ? 'w-16' : 'w-40',
    ]"
  >
    <div :class="['flex flex-col items-center gap-2', !uiStore.isCollapsed && `w-full`]">
      <RouteList :is-expanded="!uiStore.isCollapsed" />
    </div>

    <CollapseButton />
  </aside>
</template>
