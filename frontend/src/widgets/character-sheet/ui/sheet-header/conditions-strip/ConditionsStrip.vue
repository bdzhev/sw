<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Button } from '@shared/ui/button';

import { ConditionBadge } from './condition-badge';
import { ConditionsDialog } from './conditions-dialog';
import type { ConditionsStripProps } from './ConditionsStrip.types';

const props = defineProps<ConditionsStripProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const isDialogOpen = ref(false);

/** Single-shot edits — no follow-up write to carry them if the tab backgrounds. */
const commit = (conditions: string[]): void => {
  emit('patch', { conditions }, true);
};

const handleRemove = (condition: string): void => {
  commit(
    props.conditions.filter((entry) => {
      return entry !== condition;
    }),
  );
};

const handleUpdate = (conditions: string[]): void => {
  commit(conditions);
};

const handleAddClick = (): void => {
  isDialogOpen.value = true;
};
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <ConditionBadge
      v-for="condition in props.conditions"
      :key="condition"
      :condition="condition"
      @remove="handleRemove"
    />

    <Button variant="neutral" size="xs" @click="handleAddClick">
      <span class="flex items-center gap-1">
        <Plus :size="14" />

        add condition
      </span>
    </Button>

    <ConditionsDialog
      v-model:open="isDialogOpen"
      :conditions="props.conditions"
      @update="handleUpdate"
    />
  </div>
</template>
