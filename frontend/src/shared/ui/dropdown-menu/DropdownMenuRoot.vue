<script setup lang="ts">
import { ref, provide } from 'vue';

import { DROPDOWN_MENU_CTX_KEY } from './constants';
import type { DropdownMenuContext } from './DropdownMenu.types';
import type { DropdownMenuRootProps } from './DropdownMenuRoot.props';

const props = withDefaults(defineProps<DropdownMenuRootProps>(), {
  defaultOpen: false,
  closeOnOutsideClick: true,
  portalTo: 'body',
  placement: 'bottom-start',
});

const isOpen = ref(props.defaultOpen);

const triggerEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);

/**
 * No body scroll lock: it was a no-op while `main` was the only scroller, and
 * once the document scrolls below md it froze the page behind a plain menu.
 * The content is `position: fixed` instead, so it tracks the trigger on scroll.
 */
const toggleOpen = (val: boolean) => {
  isOpen.value = val;
};

provide<DropdownMenuContext>(DROPDOWN_MENU_CTX_KEY, {
  isOpen,
  toggleOpen,
  triggerEl,
  contentEl,
  portalTo: props.portalTo,
  placement: props.placement,
});
</script>

<template>
  <slot />
</template>
