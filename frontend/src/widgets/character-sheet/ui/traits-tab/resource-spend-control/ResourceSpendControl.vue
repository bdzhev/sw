<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';

import { Button } from '@shared/ui/button';

import { useResourceMeta } from '@widgets/character-sheet/model/traits/useResourceMeta';

import type { ResourceSpendControlProps } from './ResourceSpendControl.types';
import { SpendDialog } from './spend-dialog';

const props = withDefaults(defineProps<ResourceSpendControlProps>(), { isSaving: false });

const emit = defineEmits<{ spend: [amount: number] }>();

const FLAT_COST = 1;

const isDialogOpen = ref(false);

const { hasSubAbilities, isExhausted, remaining } = useResourceMeta(() => {
  return props.resource;
});

/**
 * A resource with named sub-abilities has no sensible default cost, so its primary
 * tap opens the picker. A flat one spends immediately — this button is pressed
 * mid-combat and should not cost a detour through a dialog.
 */
const handlePrimaryClick = () => {
  if (hasSubAbilities.value) {
    isDialogOpen.value = true;

    return;
  }

  emit('spend', Math.min(FLAT_COST, remaining.value));
};

const handleMoreClick = () => {
  isDialogOpen.value = true;
};

const handleSpend = (amount: number) => {
  emit('spend', amount);
};
</script>

<template>
  <div class="flex items-stretch gap-2">
    <Button
      width="full"
      class="min-h-11 flex-1"
      :is-disabled="isExhausted || props.isSaving"
      @click="handlePrimaryClick"
    >
      <span class="flex items-center gap-1">
        Use

        <ChevronDown v-if="hasSubAbilities" :size="16" />
      </span>
    </Button>

    <Button
      v-if="!hasSubAbilities"
      variant="secondary"
      equal-padding
      class="min-h-11 min-w-11"
      aria-label="More ways to use this resource"
      :is-disabled="props.isSaving"
      @click="handleMoreClick"
    >
      <ChevronDown :size="16" />
    </Button>

    <SpendDialog
      v-model:open="isDialogOpen"
      :resource="props.resource"
      :is-saving="props.isSaving"
      @spend="handleSpend"
    />
  </div>
</template>
