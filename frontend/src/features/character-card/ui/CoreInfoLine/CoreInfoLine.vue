<script setup lang="ts">
import { inject } from 'vue';

import { Text } from '@shared/ui/text';

import type { CharCardContext } from '../CharCardRoot.types';

import type { CoreInfoLineProps } from './CoreInfoLine.props';

const ctx = inject<CharCardContext>('charCardCtx')!;

const props = defineProps<CoreInfoLineProps>();
</script>

<template>
  <div class="flex flex-row gap-2">
    <Text class="font-bold">{{ props.label }}</Text>

    <Text>{{ ctx[props.field] }}</Text>
  </div>
</template>
