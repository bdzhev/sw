<script setup lang="ts">
import { Checkbox } from '@shared/ui/checkbox';

import type { DeathSavePipProps } from './DeathSavePip.types';

const props = defineProps<DeathSavePipProps>();

const emit = defineEmits<{ select: [index: number] }>();

/** The row owns the count, so a pip reports itself rather than toggling. */
const handleChange = (): void => {
  emit('select', props.index);
};
</script>

<template>
  <Checkbox
    :model-value="props.isFilled"
    :label="props.label"
    is-label-hidden
    @update:model-value="handleChange"
  />
</template>
