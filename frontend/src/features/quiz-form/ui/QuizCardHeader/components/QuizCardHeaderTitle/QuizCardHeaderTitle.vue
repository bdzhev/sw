<script setup lang="ts">
import { inject } from 'vue';

import { Skeleton } from '@shared/ui/skeleton';

import { useCharacter } from '@entities/characters';

import { QUIZ_FORM_CTX_KEY } from '../../../../config';
import type { QuizFormContext } from '../../../../model/types';

const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;

const { isCharacterFetching, character } = useCharacter(ctx.characterId);
</script>

<template>
  <div class="h-6 w-60" v-if="isCharacterFetching">
    <Skeleton class="rounded-sm" />
  </div>

  <h3 v-else class="text-primary/80">{{ character?.name }}</h3>
</template>
