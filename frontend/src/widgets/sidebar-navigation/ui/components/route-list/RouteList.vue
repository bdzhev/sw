<script setup lang="ts">
import { navRoutes } from '../../../config/navRoutes';
import { useSidebarUi } from '../../../model/useSidebarUi';

import { RouteButton } from './components';

const uiStore = useSidebarUi();
</script>

<!--prettier-ignore-->
<template>
  <nav class="w-full">
    <ul class="flex w-full flex-col gap-2 text-primary/50">
      <li v-for="route in navRoutes" :key="route.url" class="w-full">
        <RouteButton
          :is-expanded="!uiStore.isCollapsed"
          :label="route.label"
          :url="route.url"
          :icon="route.icon"
          :name="route.name"
        />
      </li>
    </ul>
  </nav>
</template>
