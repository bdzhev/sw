<script setup lang="ts">
import { computed, inject } from 'vue';

import { QUIZ_FORM_CTX_KEY } from '../../config';
import type { QuizFormContext } from '../../model/types';

const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;

const isLoading = computed(() => {
  return ctx.isStepLoading.value || ctx.currentItems.value.length === 0;
})
</script>

<template>
  <div v-if="!isLoading">
    <slot />
  </div>
</template>
