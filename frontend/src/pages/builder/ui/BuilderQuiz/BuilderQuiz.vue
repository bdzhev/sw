<script setup lang="ts">
import { useQuizData } from '../../model/useQuizData';

import { LoadingState, ErrorState, ActiveState } from './components';

const { hasError, isQuizDataLoading, onTryAgainClick } = useQuizData({
  shouldRefetchOnMount: true,
});
</script>

<template>
  <ErrorState v-if="hasError" @try-again-click="onTryAgainClick" />

  <LoadingState v-else-if="isQuizDataLoading" />

  <ActiveState v-else />
</template>
