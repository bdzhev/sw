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

/**
 * Tapping a link navigates but leaves the drawer sitting over the page it just
 * opened, so the drawer has to get out of the way itself.
 */
watch(() => {
  return route.fullPath;
}, uiStore.closeDrawer);

/**
 * Growing past md unmounts this in favour of the rail. Resetting the state here
 * is what stops a drawer that was open from being open again on the way back
 * down.
 */
onBeforeUnmount(uiStore.closeDrawer);
</script>

<template>
  <!--
    `sticky`, not `fixed`: below md the document is the scroller, so the bar can
    stay in flow and the content underneath needs no compensating top padding.
    z-500 keeps it under the drawer and the dialogs, which own z-1000.
  -->
  <header
    class="sticky top-0 z-500 flex h-14 w-full shrink-0 flex-row items-center gap-2 border-b border-border/50 bg-bg-secondary/80 px-2 backdrop-blur-md"
  >
    <BurgerButton />

    <RouterLink :to="{ name: RouteName.APP_HOME }" class="flex items-center">
      <Image
        :folder="ImageFolder.Base"
        name="goblin-fairy"
        alt="Flying goblin fairy"
        class="h-9 w-9"
      />
    </RouterLink>
  </header>

  <Drawer v-model:open="uiStore.isDrawerOpen" title="Navigation">
    <RouteList :is-expanded="true" />
  </Drawer>
</template>
