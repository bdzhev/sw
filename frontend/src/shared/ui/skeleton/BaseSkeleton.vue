<script lang="ts" setup>
import type { SkeletonProps } from './BaseSkeleton.props';

const props = withDefaults(defineProps<SkeletonProps>(), {
  shouldAnimate: true,
});

const { shouldAnimate } = props;
</script>

<template>
  <div
    :class="[
      `shimmer relative h-full w-full overflow-hidden bg-fg/30`,
      { 'shimmer-animate': shouldAnimate },
    ]"
  />
</template>
