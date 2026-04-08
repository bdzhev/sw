<script setup lang="ts">
import { TryAgainCard } from '@widgets/try-again-card';

import type { ErrorStateProps } from './ErrorState.props';

const props = defineProps<ErrorStateProps>();
</script>

<template>
  <TryAgainCard
    title="Damn"
    decription="Something went wrong"
    @try-again-click="props.onTryAgainClick"
  />
</template>
