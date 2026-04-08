<script setup lang="ts">
import { provide } from 'vue';

import { BUILDER_QUIZ_CTX_KEY } from '../../config';

import { type BuilderProviderProps } from './BuilderProvider.props';
import type { BuilderContextValues } from './BuilderProvider.types';

const props = defineProps<BuilderProviderProps>();

provide<BuilderContextValues>(BUILDER_QUIZ_CTX_KEY, {
  characterId: props.characterId,
})
</script>

<template>
  <slot />
</template>