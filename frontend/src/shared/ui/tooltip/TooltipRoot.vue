<script setup lang="ts">
import { useElementHover } from '@vueuse/core';
import { provide, ref, watch } from 'vue';

import { TOOLTIP_CTX_KEY, DEFAULT_TIMEOUT_DELAY } from './constants';
import type { TooltipContext } from './Tooltip.types';
import type { TooltipRootProps } from './TooltipRoot.props';

const DEFAULT_OFFSET = 8;

const props = withDefaults(defineProps<TooltipRootProps>(), {
  portalTo: 'body',
  delay: DEFAULT_TIMEOUT_DELAY,
  placement: 'bottom-start',
  offset: DEFAULT_OFFSET,
});

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const isOpen = ref(false);
const isTriggerHovered = useElementHover(triggerRef);
const isContentHovered = useElementHover(contentRef);

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const clearCloseTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

const updateVisibility = () => {
  if (isTriggerHovered.value || isContentHovered.value) {
    clearCloseTimeout();
    isOpen.value = true;
  } else {
    clearCloseTimeout();
    timeoutId = setTimeout(() => {
      isOpen.value = false;
    }, props.delay);
  }
};

watch([isContentHovered, isTriggerHovered], updateVisibility, {
  immediate: true,
});

provide<TooltipContext>(TOOLTIP_CTX_KEY, {
  portalTo: props.portalTo,
  isOpen,
  triggerRef,
  contentRef,
  placement: props.placement,
  offset: props.offset,
});
</script>

<template>
  <slot />
</template>
