<script setup lang="ts">
import { provide } from 'vue';

import { Card } from '@shared/ui/card';

import type { CharCardRootProps } from './CharCardRoot.props';
import type { CharCardContext } from './CharCardRoot.types';

const props = defineProps<CharCardRootProps>();

provide<CharCardContext>('charCardCtx', props);
</script>

<template>
  <Card class="flex flex-col">
    <slot />
  </Card>
</template>
