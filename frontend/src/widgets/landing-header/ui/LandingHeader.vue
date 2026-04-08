<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import { ImageFolder } from '@shared/lib/assets';
import { RouteName } from '@shared/lib/router';
import { useHasScrolled } from '@shared/lib/ui';
import { Button } from '@shared/ui/button';
import { Image } from '@shared/ui/image';

import { useUser } from '@entities/user';

import { useHeaderUiStore } from '../model/useHeaderUiStore';

import { NavLink } from './components';

const SCROLL_THRESHOLD = 300;

const uiStore = useHeaderUiStore();

onBeforeRouteLeave(uiStore.resetHasScrolled);

const { isLoggedIn } = useUser();

useHasScrolled({
  threshold: SCROLL_THRESHOLD,
  setHasScrolled: uiStore.setHasScrolled,
});

const handleLinkClick = () => {
  uiStore.resetHasScrolled();
};

onUnmounted(() => {
  uiStore.$dispose();
});
</script>

<template>
  <header class="fixed z-1000 flex w-full justify-center pt-4" ref="header">
    <nav
      :class="[
        {
          'flex flex-row items-center justify-between rounded-full p-2 transition-all duration-300': true,
          'bg-primary-bg/80 backdrop-blur-sm': uiStore.hasScrolled,
        },
        uiStore.hasScrolled
          ? `
            pl-8
            sm:w-[80%]
            lg:w-[30%]
          `
          : `w-full px-20`,
      ]"
    >
      <NavLink :link="{ name: RouteName.HOME }">
        <Image
          :folder="ImageFolder.Base"
          name="goblin-fairy"
          alt="Flying goblin fairy"
          class="h-12 w-12"
        />
      </NavLink>

      <div class="flex flex-row items-center gap-8">
        <NavLink
          v-if="!isLoggedIn"
          :link="{ name: RouteName.LOGIN }"
          v-on:click="handleLinkClick"
        >
          Sign in
        </NavLink>

        <RouterLink
          :to="
            isLoggedIn
              ? { name: RouteName.APP_HOME }
              : { name: RouteName.SIGNUP }
          "
          @click="handleLinkClick"
        >
          <Button :is-round="true" size="md">
            {{ isLoggedIn ? 'Go to account' : 'Sign Up' }}
          </Button>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
