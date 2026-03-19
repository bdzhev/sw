<script setup lang="ts">

import { useRouteParam } from '../lib/useRouteParam';

import { QuizSteps } from './QuizSteps';

const { characterId } = useRouteParam();
</script>

<template>
  <QuizSteps :character-id="characterId" />
</template>
