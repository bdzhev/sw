<script lang="ts" setup>
import { useElementBounding } from '@vueuse/core';
import { useField } from 'vee-validate';
import { ref, computed } from 'vue';

import type { BaseSliderProps } from './BaseSlider.props';

const props = withDefaults(defineProps<BaseSliderProps>(), {
  min: 1,
  max: 5,
  step: 1,
  shouldShowTicks: false,
});

const { value, handleBlur, handleChange } = useField<number>(() => {
  return props.name;
});

const slider = ref<HTMLElement | null>(null);
const thumb = ref<HTMLElement | null>(null);

const { left, width } = useElementBounding(slider);

const isDragging = ref(false);

/**
 * Calculate the thumb position in percents.
 */
const thumbPercent = computed(() => {
  const range = props.max - props.min;

  if (range === 0) {
    return range;
  }

  const result = ((value.value - props.min) / range) * 100;

  return result;
});

/**
 * Lil bit of math to set the model value from width in pixels.
 */
const setValueFromClientX = (clientX: number) => {
  if (!width.value) {
    return;
  }

  const relative = clientX - left.value;
  const clamped = Math.min(Math.max(0, relative), width.value);
  const ratio = clamped / width.value;

  let newVal = props.min + ratio * (props.max - props.min);
  newVal = Math.round(newVal / props.step) * props.step;
  handleChange(newVal);
};

/**
 * Lil breakdown: if started pointerDown event on thumb,
 * then start dragging, otherwise, just set the model value.
 */
const onPointerDown = (e: PointerEvent) => {
  const target = e.target;

  const startedOnThumb =
    thumb.value &&
    target instanceof Node &&
    (thumb.value === target || thumb.value.contains(target));

  setValueFromClientX(e.clientX);

  if (startedOnThumb && slider.value) {
    isDragging.value = true;
    slider.value?.setPointerCapture(e.pointerId);
  }
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) {
    return;
  }

  setValueFromClientX(e.clientX);
};

const onPointerUp = (e: PointerEvent) => {
  if (!isDragging.value) {
    return;
  }

  isDragging.value = false;
  slider.value?.releasePointerCapture(e.pointerId);
  handleBlur();
};
</script>

<template>
  <div ref="slider" class="
    relative flex h-6 w-full cursor-pointer items-center justify-center
    select-none
  " @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp"
    role="slider" :aria-valuemin="props.min" :aria-valuemax="props.max" :aria-valuenow="value.value" tabindex="0">
    <div class="absolute right-0 left-0 h-1.5 rounded-md bg-fg/30" />

    <div class="absolute right-0 left-0 h-1.5 rounded-md bg-fg transition-all" :style="{ width: `${thumbPercent}%` }" />

    <div v-if="props.shouldShowTicks" class="absolute top-1 h-2 w-full">
      <div v-for="n in props.max" :key="n" class="
        absolute h-4 w-0.5 rounded-sm bg-secondary
      " :class="{ hidden: n === props.min || n === props.max }" :style="{
        left: `${((n - props.min) / (props.max - props.min)) * 100}%`,
        transform: 'translateX(-50%)',
      }" />
    </div>

    <div ref="thumb" class="
      absolute flex h-4 w-4 translate-x-[-50%] items-center justify-center
      rounded-full border-2 border-accent-primary bg-accent-primary text-center
      text-sm font-bold text-transparent transition-all duration-150
      hover:h-7 hover:w-7 hover:bg-bg-secondary hover:text-primary
      active:h-7 active:w-7 active:bg-bg-secondary active:text-primary
    " :style="{
      left: `min(max(${thumbPercent}%, 2%), 98%)`,
      touchAction: 'none',
    }" aria-hidden="true">
      {{ value }}
    </div>
  </div>
</template>
