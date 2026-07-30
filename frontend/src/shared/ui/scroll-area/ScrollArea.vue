<script setup lang="ts">
import { useResizeObserver, useScroll } from '@vueuse/core';
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'reka-ui';
import { computed, ref } from 'vue';

import { ScrollBar } from './scroll-bar';
import type { ScrollAreaProps } from './ScrollArea.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  orientation: 'vertical',
  type: 'hover',
  scrollHideDelay: 600,
  shouldFade: false,
});

const viewportRef = ref<InstanceType<typeof ScrollAreaViewport>>();

const viewportEl = computed(() => {
  return viewportRef.value?.viewportElement;
});

const contentEl = computed(() => {
  return viewportEl.value?.firstElementChild as HTMLElement | undefined;
});

const { arrivedState, measure } = useScroll(viewportEl, {
  offset: { top: 4, bottom: 4 },
});

useResizeObserver([viewportEl, contentEl], measure);

const hasFadeTop = computed(() => {
  return props.shouldFade && !arrivedState.top;
});

const hasFadeBottom = computed(() => {
  return props.shouldFade && !arrivedState.bottom;
});
</script>

<template>
  <ScrollAreaRoot
    v-bind="$attrs"
    :type="props.type"
    :scroll-hide-delay="props.scrollHideDelay"
    class="relative overflow-hidden"
  >
    <ScrollAreaViewport
      ref="viewportRef"
      :class="{
        'h-full w-full': true,
        'fade-scroll-top': hasFadeTop && !hasFadeBottom,
        'fade-scroll-bottom': hasFadeBottom && !hasFadeTop,
        'fade-scroll-y': hasFadeTop && hasFadeBottom,
      }"
    >
      <slot />
    </ScrollAreaViewport>

    <ScrollBar :orientation="props.orientation" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
