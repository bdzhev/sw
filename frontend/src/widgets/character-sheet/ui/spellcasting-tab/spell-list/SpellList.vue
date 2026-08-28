<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import type { CharacterSpell } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { Separator } from '@shared/ui/separator';
import { Text } from '@shared/ui/text';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { SpellRow } from './spell-row';
import type { SpellListProps } from './SpellList.types';

const props = withDefaults(defineProps<SpellListProps>(), { isSaving: false });

const emit = defineEmits<{
  add: [];
  open: [spell: CharacterSpell];
  cast: [spell: CharacterSpell];
  remove: [spell: CharacterSpell];
}>();

const handleAddClick = (): void => {
  emit('add');
};

const handleOpen = (spell: CharacterSpell): void => {
  emit('open', spell);
};

const handleCast = (spell: CharacterSpell): void => {
  emit('cast', spell);
};

const handleRemove = (spell: CharacterSpell): void => {
  emit('remove', spell);
};
</script>

<template>
  <!-- One flat list, known and prepared together: the sheet does not model
       preparation, so splitting it would be a distinction the data cannot make. -->
  <SheetSection title="Spells" variant="plain">
    <template #actions>
      <Button size="xs" class="min-h-11" @click="handleAddClick">
        <span class="flex items-center gap-1">
          <Plus :size="16" />
          Add
        </span>
      </Button>
    </template>

    <Separator />

    <Text v-if="!props.spells.length" size="sm" theme="secondary">
      Nothing written down yet. Search the library, or type in something of your own.
    </Text>

    <ul v-else class="flex flex-col gap-2">
      <SpellRow
        v-for="spell in props.spells"
        :key="spell.id"
        :spell="spell"
        :slots="props.slots"
        :is-saving="props.isSaving"
        @open="handleOpen"
        @cast="handleCast"
        @remove="handleRemove"
      />
    </ul>
  </SheetSection>
</template>
