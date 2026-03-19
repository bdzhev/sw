<script setup lang="ts">
import { useScrollLock } from '@vueuse/core';
import { ref, watch, provide } from 'vue';

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

const isScrollLocked = useScrollLock(document.body);

watch(isOpen, (open) => {
  isScrollLocked.value = open;
});

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
