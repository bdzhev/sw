<script setup lang="ts">
import { DialogContent as DialogContentPrimitive } from 'reka-ui';

import type { DialogContentProps } from './DialogContent.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogContentProps>(), {
  disableOutsideClose: false,
});

const handleInteractOutside = (event: Event) => {
  if (props.disableOutsideClose) {
    event.preventDefault();
  }
};
</script>

<template>
  <!--
    Width is phone-first: full width minus the page gutter, capped from there.
    `svh` for the height cap, so a tall dialog stays reachable when the mobile
    address bar is showing. The centring translate is repeated by the keyframes —
    see the comment on them in main.css.
  -->
  <DialogContentPrimitive
    v-bind="$attrs"
    class="fixed top-1/2 left-1/2 z-1000 flex max-h-[85svh] w-[calc(100%-2rem)] max-w-lg -translate-1/2 flex-col overflow-y-auto rounded-md bg-bg-secondary data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in motion-reduce:animate-none"
    @interact-outside="handleInteractOutside"
  >
    <slot />
  </DialogContentPrimitive>
</template>
