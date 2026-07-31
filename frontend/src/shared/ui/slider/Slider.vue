<script lang="ts" setup>
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui';
import { useField } from 'vee-validate';
import { computed } from 'vue';

import type { SliderProps } from './Slider.types';

const props = withDefaults(defineProps<SliderProps>(), {
  label: undefined,
  min: 1,
  max: 5,
  step: 1,
  shouldShowTicks: false,
});

const { value, handleBlur, handleChange } = useField<number>(() => {
  return props.name;
});

/** reka models a multi-thumb slider, so its value is an array of one here. */
const sliderValue = computed({
  get: () => {
    return [value.value ?? props.min];
  },
  set: (next: number[]) => {
    handleChange(next[0]);
  },
});

/** Interior ticks only — the ends are already marked by the track. */
const tickPercents = computed(() => {
  if (!props.shouldShowTicks) {
    return [];
  }

  const range = props.max - props.min;

  if (range <= 0) {
    return [];
  }

  const percents: number[] = [];

  for (let tick = props.min + props.step; tick < props.max; tick += props.step) {
    percents.push(((tick - props.min) / range) * 100);
  }

  return percents;
});
</script>

<template>
  <SliderRoot
    v-model="sliderValue"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    class="relative flex h-11 w-full touch-none items-center select-none md:h-6"
    @value-commit="handleBlur()"
  >
    <SliderTrack class="relative h-1.5 w-full grow rounded-md bg-fg/30">
      <SliderRange class="absolute h-full rounded-md bg-fg" />

      <div
        v-for="percent in tickPercents"
        :key="percent"
        class="absolute top-1/2 h-2 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-secondary"
        :style="{ left: `${percent}%` }"
      />
    </SliderTrack>

    <!-- `after:` widens the grab area to 44px without growing the circle. -->
    <SliderThumb
      :aria-label="props.label"
      class="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent-primary bg-bg-secondary text-xs font-bold text-primary transition-colors after:absolute after:-inset-2 after:content-[''] focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:outline-none md:after:hidden"
    >
      {{ value }}
    </SliderThumb>
  </SliderRoot>
</template>
