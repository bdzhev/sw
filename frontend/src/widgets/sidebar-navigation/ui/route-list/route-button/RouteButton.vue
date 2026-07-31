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
  <TooltipRoot>
    <RouterLink
      :to="props.url"
      class="block transition-all duration-100 hover:text-secondary"
    >
      <TooltipTrigger as-child>
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

    <TooltipPortal v-if="!props.isExpanded">
      <TooltipContent side="right">
        {{ props.label }}
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
