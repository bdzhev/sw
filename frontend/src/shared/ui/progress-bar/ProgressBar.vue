<script setup lang="ts">
import type { ProgressBarProps } from './ProgressBar.props';

const props = defineProps<ProgressBarProps>();
</script>

<template>
  <div class="flex w-full flex-row items-center gap-4 py-2">
    <div ref="totalBar" class="h-2 w-full rounded-full bg-fg/50">
      <div ref="activeBar" class="h-full rounded-full bg-accent-primary" :style="{ width: `${props.progress}%` }" />
    </div>

    <slot />
  </div>
</template>
