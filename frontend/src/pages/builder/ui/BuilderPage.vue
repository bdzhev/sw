<script setup lang="ts">
import { useBreakpoint } from '@shared/lib/ui';

import { MobileNavHeader } from '@widgets/sidebar-navigation';

import { useRouteParam } from '../lib/useRouteParam';
import { BuilderProvider } from '../model/BuilderProvider';
import { BuilderQuiz } from './builder-quiz';

const { characterId } = useRouteParam();
const { isMobile } = useBreakpoint();
</script>

<template>
  <MobileNavHeader v-if="isMobile" />

  <BuilderProvider :character-id="characterId">
    <BuilderQuiz />
  </BuilderProvider>
</template>
