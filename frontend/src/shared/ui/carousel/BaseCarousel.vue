<script lang="ts" setup>
import { useEventListener } from '@vueuse/core';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

import { Button } from '@shared/ui/button';

import type { BaseCarouselProps } from './BaseCarousel.props';

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
let items: Element[] = [];

const updateCarousel = (index: number, animate = true) => {
  const duration = animate ? 0.45 : 0;

  items.forEach((el, i) => {
    const distance = Math.abs(i - index);
    const isActive = i === index;

    (el as HTMLElement).style.pointerEvents = isActive ? 'auto' : 'none';

    gsap.to(el, {
      scale: isActive ? 1 : 0.85,
      filter: isActive
        ? 'blur(0px) brightness(1)'
        : 'blur(3px) brightness(0.55)',
      opacity: distance > 1 ? 0 : 1,
      duration,
      ease: 'power2.out',
    });
  });

  if (!trackRef.value || !outerRef.value || !items.length) return;

  const itemW = (items[0] as HTMLElement).offsetWidth;
  const containerW = outerRef.value.offsetWidth;
  const x = containerW / 2 - index * (itemW + props.gap) - itemW / 2;

  gsap.to(trackRef.value, { x, duration, ease: 'power2.out' });
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
  if (activeIndex.value < items.length - 1) {
    go(activeIndex.value + 1);
  }
};

onMounted(() => {
  if (!trackRef.value) {
    return;
  }

  items = Array.from(trackRef.value.children);
  updateCarousel(activeIndex.value, false);
});

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    prev();
  }

  if (e.key === 'ArrowRight') {
    next();
  }
});
</script>

<template>
  <div
    ref="outerRef"
    class="relative flex h-full w-full items-center overflow-hidden"
  >
    <Button
      :is-disabled="activeIndex === 0"
      :is-round="true"
      :equal-padding="true"
      class="absolute left-4 z-10"
      @click="prev"
    >
      <ChevronLeft :size="20" />
    </Button>

    <div
      ref="trackRef"
      class="flex will-change-transform"
      :style="{ gap: `${gap}px` }"
    >
      <slot />
    </div>

    <Button
      :is-disabled="activeIndex === items.length - 1"
      :is-round="true"
      :equal-padding="true"
      class="absolute right-4 z-10"
      @click="next"
    >
      <ChevronRight :size="20" />
    </Button>
  </div>
</template>
