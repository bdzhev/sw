<script setup lang="ts">
import { useRouteParam } from '../lib/useRouteParam';
import { BuilderProvider } from '../model/BuilderProvider';

import { BuilderQuiz } from './BuilderQuiz';

const { characterId } = useRouteParam();
</script>

<template>
  <BuilderProvider :character-id="characterId">
    <BuilderQuiz />
  </BuilderProvider>
</template>
