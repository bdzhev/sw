<script setup lang="ts">
import { inject } from 'vue';

import type { CharCardContext } from '../CharCardRoot.types';

import type { CoreInfoLineProps } from './CoreInfoLine.props';

const ctx = inject<CharCardContext>('charCardCtx')!;

const props = defineProps<CoreInfoLineProps>();

</script>

<template>
  <div class="flex flex-row gap-2">
    <p class="font-bold">{{ props.label }}</p>

    <p>{{ ctx[props.field] }}</p>
  </div>
</template>
