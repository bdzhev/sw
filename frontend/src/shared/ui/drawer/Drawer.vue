<script setup lang="ts">
import { usePointerSwipe } from '@vueuse/core';
import { DialogContent, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import { ref } from 'vue';

import { DialogOverlay } from '@shared/ui/dialog';

import { animationClasses, sideClasses } from './Drawer.themes';
import type { DrawerProps } from './Drawer.types';

/**
 * How far a swipe has to travel before it counts as "close this", in px.
 */
const SWIPE_CLOSE_THRESHOLD = 60;

const props = withDefaults(defineProps<DrawerProps>(), {
  side: 'left',
});

const isOpen = defineModel<boolean>('open', { required: true });

/**
 * A ref on a real element inside the content, not on the DialogContent
 * component: the component's instance identity never changes, so anything
 * derived from its `$el` keeps whatever that was when the drawer was closed —
 * a comment node, since the content is only mounted while open.
 */
const panelRef = ref<HTMLElement | null>(null);

/**
 * Touch and pen only: a mouse drag across a link inside the drawer should not
 * dismiss it. Swipe-from-edge to *open* is deliberately absent — it collides
 * with the OS back gesture on iOS.
 */
usePointerSwipe(panelRef, {
  threshold: SWIPE_CLOSE_THRESHOLD,
  pointerTypes: ['touch', 'pen'],
  onSwipeEnd: (_event, direction) => {
    if (direction !== props.side) {
      return;
    }

    isOpen.value = false;
  },
});
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        :aria-describedby="undefined"
        :class="[
          'fixed top-0 z-1000 flex h-[100svh] w-72 max-w-[85%] flex-col border-border bg-bg-elevated/95 backdrop-blur-3xl motion-reduce:animate-none',
          sideClasses[props.side],
          animationClasses[props.side],
        ]"
      >
        <DialogTitle class="sr-only">{{ props.title }}</DialogTitle>

        <div ref="panelRef" class="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
