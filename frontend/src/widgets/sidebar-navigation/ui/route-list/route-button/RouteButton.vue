<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { Button } from '@shared/ui/button';
import {
  TooltipRoot,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@shared/ui/tooltip';

import type { RouteButtonProps } from './RouteButton.types';

const props = defineProps<RouteButtonProps>();

const route = useRoute();

const isActive = computed(() => {
  return route.name === props.name;
});

const iconProps = {
  size: 20,
};
</script>

<template>
  <!--
    The tooltip only exists for the collapsed rail. In the mobile drawer
    `isExpanded` is always true, so nothing hover-gated is created there — a
    tooltip is unreachable on touch.
  -->
  <TooltipRoot placement="right">
    <TooltipPortal v-if="!props.isExpanded">
      <TooltipContent>
        <RouterLink :to="props.url" class="hover:text-accent-primary">
          {{ props.label }}
        </RouterLink>
      </TooltipContent>
    </TooltipPortal>

    <RouterLink
      :to="props.url"
      class="block transition-all duration-100 hover:text-secondary"
    >
      <TooltipTrigger class="w-full">
        <!--
          `min-h-11` is the 44px touch floor for the drawer; the rail is a
          pointer surface and keeps the tighter xs height from md up.
        -->
        <Button
          :variant="isActive ? 'primary' : 'transparent'"
          equal-padding
          size="xs"
          width="full"
          :class="{
            'relative min-h-11 md:min-h-0': true,
            'justify-start gap-2': props.isExpanded,
          }"
        >
          <component :is="props.icon" v-bind="iconProps" />

          <span
            :class="[
              props.isExpanded ? 'max-w-[200px] opacity-100' : `max-w-0 opacity-0`,
              `overflow-hidden whitespace-nowrap transition-all duration-50`,
            ]"
          >
            {{ props.label }}
          </span>
        </Button>
      </TooltipTrigger>
    </RouterLink>
  </TooltipRoot>
</template>
