<script setup lang="ts">
import { computed } from 'vue';

import { FIELD_LABEL_CLASSES } from '@shared/ui/field-label';

import { DeathSavePip } from './death-save-pip';
import type { PipRowProps } from './PipRow.types';

const props = defineProps<PipRowProps>();

const emit = defineEmits<{ change: [count: number] }>();

const pips = computed(() => {
  return Array.from({ length: props.total }, (_, index) => {
    return {
      index,
      isFilled: index < props.count,
      label: `${props.pipLabel} ${index + 1}`,
    };
  });
});

/** Picking pip i fills up to it, unless it is already the last filled one. */
const handleSelect = (index: number): void => {
  emit('change', props.count === index + 1 ? index : index + 1);
};
</script>

<template>
  <fieldset class="min-w-0 border-0 p-0">
    <!-- Margin, not a flex gap: a fieldset lays its legend out specially. -->
    <legend :class="[FIELD_LABEL_CLASSES, 'mb-1']">{{ props.legend }}</legend>

    <div class="flex items-center">
      <DeathSavePip
        v-for="pip in pips"
        :key="pip.index"
        :index="pip.index"
        :is-filled="pip.isFilled"
        :label="pip.label"
        @select="handleSelect"
      />
    </div>
  </fieldset>
</template>
