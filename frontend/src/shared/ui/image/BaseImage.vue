<script lang="ts" setup>
import { computed } from 'vue';

import { assetsService } from '@shared/lib/assets';

import type { ImageProps } from './BaseImage.props';

const props = withDefaults(defineProps<ImageProps>(), {
  format: 'png',
  alt: '',
});

const src = computed(() => {
  return assetsService.getImagePath(
    props.folder,
    `${props.name}.${props.format}`,
  );
});
</script>

<template>
  <img :src="src" :alt="props.alt" />
</template>
