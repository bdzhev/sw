<script setup lang="ts">
import { useQuizData } from '../../model/useQuizData';
import { ActiveState } from './active-state';
import { ErrorState } from './error-state';
import { LoadingState } from './loading-state';

const { hasError, isQuizDataLoading, onTryAgainClick } = useQuizData({
  shouldRefetchOnMount: true,
});
</script>

<template>
  <ErrorState v-if="hasError" @try-again-click="onTryAgainClick" />

  <LoadingState v-else-if="isQuizDataLoading" />

  <ActiveState v-else />
</template>
