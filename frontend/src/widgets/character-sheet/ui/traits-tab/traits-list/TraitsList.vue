<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import type { Trait } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { Separator } from '@shared/ui/separator';
import { Text } from '@shared/ui/text';

import { useTraitsUi } from '@widgets/character-sheet/model/traits';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { TraitRow } from '../trait-row';
import type { TraitsListProps } from './TraitsList.types';

const props = withDefaults(defineProps<TraitsListProps>(), { isSaving: false });

const emit = defineEmits<{ togglePin: [trait: Trait] }>();

const ui = useTraitsUi();

/** `null` is the store's "add", as opposed to editing an existing row. */
const handleAddClick = (): void => {
  ui.openTraitDialog(null);
};

const handleTogglePin = (trait: Trait): void => {
  emit('togglePin', trait);
};
</script>

<template>
  <SheetSection title="Traits &amp; features" variant="plain">
    <template #actions>
      <Button size="xs" class="min-h-11" @click="handleAddClick">
        <span class="flex items-center gap-1">
          <Plus :size="16" />
          Add
        </span>
      </Button>
    </template>

    <Separator />

    <Text v-if="!props.traits.length" size="sm" theme="secondary">
      Nothing here yet. Add racial abilities, class features and feats as you learn them.
    </Text>

    <ul v-else class="flex flex-col gap-2">
      <TraitRow
        v-for="trait in props.traits"
        :key="trait.id"
        :trait="trait"
        :is-saving="props.isSaving"
        @toggle-pin="handleTogglePin"
      />
    </ul>
  </SheetSection>
</template>
