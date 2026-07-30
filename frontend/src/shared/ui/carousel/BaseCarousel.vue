<script lang="ts" setup>
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

import { Button } from '@shared/ui/button';

import type { BaseCarouselProps } from './BaseCarousel.types';

const props = withDefaults(defineProps<BaseCarouselProps>(), {
  initialIndex: 0,
  gap: 24,
});

const emit = defineEmits<{
  change: [index: number];
}>();

const outerRef = ref<HTMLElement>();
const trackRef = ref<HTMLElement>();

const activeIndex = ref(props.initialIndex);
const items = ref<HTMLElement[]>([]);

const applyAppearance = (index: number, duration: number) => {
  items.value.forEach((el, i) => {
    const distance = Math.abs(i - index);
    const isActive = i === index;

    el.style.pointerEvents = isActive ? 'auto' : 'none';

    const vars = {
      scale: isActive ? 1 : 0.85,
      filter: isActive ? 'blur(0px) brightness(1)' : 'blur(3px) brightness(0.55)',
      opacity: distance > 1 ? 0 : 1,
    };

    if (!duration) {
      gsap.set(el, vars);

      return;
    }

    gsap.to(el, { ...vars, duration, ease: 'power2.out', overwrite: true });
  });
};

const applyPosition = (index: number, duration: number) => {
  if (!trackRef.value || !outerRef.value || !items.value.length) {
    return;
  }

  const itemW = items.value[0].offsetWidth;
  const containerW = outerRef.value.offsetWidth;

  if (!itemW || !containerW) {
    return;
  }

  const x = containerW / 2 - index * (itemW + props.gap) - itemW / 2;

  if (!duration) {
    gsap.set(trackRef.value, { x });

    return;
  }

  gsap.to(trackRef.value, { x, duration, ease: 'power2.out', overwrite: true });
};

const updateCarousel = (index: number, animate = true) => {
  const duration = animate ? 0.45 : 0;

  applyAppearance(index, duration);
  applyPosition(index, duration);
};

const go = (index: number) => {
  activeIndex.value = index;
  updateCarousel(index);
  emit('change', index);
};

const prev = () => {
  if (activeIndex.value > 0) {
    go(activeIndex.value - 1);
  }
};

const next = () => {
  if (activeIndex.value < items.value.length - 1) {
    go(activeIndex.value + 1);
  }
};

const handleMount = () => {
  if (!trackRef.value) {
    return;
  }

  items.value = Array.from(trackRef.value.children) as HTMLElement[];
  updateCarousel(activeIndex.value, false);
};

const handleResize = () => {
  applyPosition(activeIndex.value, 0);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    prev();
  }

  if (event.key === 'ArrowRight') {
    next();
  }
};

onMounted(handleMount);

useResizeObserver([outerRef, trackRef], handleResize);

useEventListener(window, 'keydown', handleKeydown);
</script>

<template>
  <div class="relative flex h-full min-h-0 w-full flex-col">
    <div
      ref="outerRef"
      class="relative flex min-h-0 w-full flex-1 items-center overflow-hidden py-4"
    >
      <div
        ref="trackRef"
        class="flex h-full will-change-transform"
        :style="{ gap: `${gap}px` }"
      >
        <slot />
      </div>
    </div>

    <div
      class="pointer-events-none z-10 flex shrink-0 justify-center gap-4 pb-2 md:absolute md:inset-x-4 md:top-1/2 md:-translate-y-1/2 md:justify-between md:pb-0"
    >
      <Button
        :is-disabled="activeIndex === 0"
        :is-round="true"
        :equal-padding="true"
        class="pointer-events-auto"
        @click="prev"
      >
        <ChevronLeft :size="20" />
      </Button>

      <Button
        :is-disabled="activeIndex === items.length - 1 || !items.length"
        :is-round="true"
        :equal-padding="true"
        class="pointer-events-auto"
        @click="next"
      >
        <ChevronRight :size="20" />
      </Button>
    </div>
  </div>
</template>
