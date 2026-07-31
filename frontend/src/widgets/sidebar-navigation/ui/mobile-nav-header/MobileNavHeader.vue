<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { ImageFolder } from '@shared/lib/assets';
import { RouteName } from '@shared/lib/router';
import { Drawer } from '@shared/ui/drawer';
import { Image } from '@shared/ui/image';

import { useSidebarUi } from '../../model/useSidebarUi';
import { RouteList } from '../route-list';
import { BurgerButton } from './burger-button';

const uiStore = useSidebarUi();
const route = useRoute();

/** Tapping a link navigates but leaves the drawer over the page it just opened. */
watch(() => {
  return route.fullPath;
}, uiStore.closeDrawer);

/** Growing past md unmounts this, so the state must not survive into the rail. */
onBeforeUnmount(uiStore.closeDrawer);
</script>

<template>
  <header
    class="sticky top-0 z-500 flex h-mobile-bar w-full shrink-0 flex-row items-center gap-2 border-b border-border bg-bg-secondary/80 page-x backdrop-blur-md"
  >
    <BurgerButton class="-ml-3" />

    <RouterLink :to="{ name: RouteName.APP_HOME }" class="flex items-center">
      <Image
        :folder="ImageFolder.Base"
        name="goblin-fairy"
        alt="Flying goblin fairy"
        class="h-9 w-9"
      />
    </RouterLink>

    <div class="ml-auto flex flex-row items-center gap-2">
      <slot />
    </div>
  </header>

  <Drawer v-model:open="uiStore.isDrawerOpen" title="Navigation">
    <RouteList :is-expanded="true" />
  </Drawer>
</template>
