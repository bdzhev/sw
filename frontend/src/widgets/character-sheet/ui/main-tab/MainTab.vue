<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { Skeleton } from '@shared/ui/skeleton';

import { useCharacter, useSheetAutosave } from '@entities/characters';

import { AbilityScores } from './ability-scores';
import { HitDice } from './hit-dice';
import { Inspiration } from './inspiration';
import { SavingThrows } from './saving-throws';
import { SheetActions } from './sheet-actions';

const route = useRoute();
const id = route.params.id as string;

// Cache hit: the page has already fetched this character.
const { character } = useCharacter({ id });
const autosave = useSheetAutosave();

const sheet = computed(() => {
  return character.value?.sheet;
});

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

const onPatch = (patch: SheetPatch, immediate = false) => {
  autosave.patchSheet(patch, immediate);
};
</script>

<template>
  <Skeleton v-if="!sheet || !character" class="h-96 w-full rounded-lg" />

  <div v-else class="flex flex-col gap-4">
    <AbilityScores :sheet="sheet" :items="items" @patch="onPatch" />

    <SavingThrows :sheet="sheet" :items="items" @patch="onPatch" />

    <div class="grid gap-4 md:grid-cols-2">
      <HitDice
        :sheet="sheet"
        :character-class="character.character.characterClass"
        @patch="onPatch"
      />

      <Inspiration :inspiration="sheet.inspiration" @patch="onPatch" />
    </div>

    <SheetActions />
  </div>
</template>
