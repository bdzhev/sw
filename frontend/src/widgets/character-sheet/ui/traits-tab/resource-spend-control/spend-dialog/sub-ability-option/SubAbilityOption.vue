<script setup lang="ts">
import { computed } from 'vue';

import { Button } from '@shared/ui/button';

import type { SubAbilityOptionProps } from './SubAbilityOption.types';

const props = withDefaults(defineProps<SubAbilityOptionProps>(), {
  isSelected: false,
  isDisabled: false,
});

const emit = defineEmits<{ select: [] }>();

const costLabel = computed(() => {
  return props.ability.cost === null ? 'varies' : String(props.ability.cost);
});

/** The accent ring the primary variant already carries *is* the selected state. */
const variant = computed(() => {
  return props.isSelected ? 'primary' : 'secondary';
});
</script>

<template>
  <li>
    <Button
      :variant="variant"
      width="full"
      size="sm"
      class="min-h-11"
      :is-disabled="props.isDisabled"
      @click="emit('select')"
    >
      <span class="flex w-full items-center justify-between gap-3">
        <span class="flex min-w-0 flex-col text-left">
          <span class="truncate">{{ props.ability.name }}</span>

          <span v-if="props.ability.note" class="text-xs text-secondary">
            {{ props.ability.note }}
          </span>
        </span>

        <span class="shrink-0 text-xs text-secondary">{{ costLabel }}</span>
      </span>
    </Button>
  </li>
</template>
