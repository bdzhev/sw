<script setup lang="ts">
import { useQuizData } from '../../model/useQuizData';
import { ActiveState } from './active-state';
import { ErrorState } from './error-state';
import { LoadingState } from './loading-state';

const { hasError, isQuizDataLoading, refetchQuizData } = useQuizData({
  shouldRefetchOnMount: true,
});

const handleTryAgainClick = () => {
  refetchQuizData();
};
</script>

<template>
  <ErrorState v-if="hasError" @try-again-click="handleTryAgainClick" />

  <LoadingState v-else-if="isQuizDataLoading" />

  <ActiveState v-else />
</template>
