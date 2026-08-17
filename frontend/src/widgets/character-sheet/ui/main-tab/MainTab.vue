<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { useBreakpoint } from '@shared/lib/ui';
import { Separator } from '@shared/ui/separator';
import { Skeleton } from '@shared/ui/skeleton';

import { useCharacter, useSheetAutosave } from '@entities/characters';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { AbilityScores } from './ability-scores';
import { HitDice } from './hit-dice';
import { Inspiration } from './inspiration';
import { SavingThrows } from './saving-throws';
import { SheetActions } from './sheet-actions';

const { isMobile } = useBreakpoint();

const route = useRoute();
const id = route.params.id as string;

const { character } = useCharacter({ id });
const autosave = useSheetAutosave();

const sheet = computed(() => {
  return character.value?.sheet;
});

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

const handlePatch = (patch: SheetPatch, immediate = false) => {
  autosave.patchSheet(patch, immediate);
};

/** The row becomes a column below md, and a rule has to turn with it. */
const separatorOrientation = computed(() => {
  return isMobile.value ? 'horizontal' : 'vertical';
});
</script>

<template>
  <Skeleton v-if="!sheet || !character" class="h-96 w-full rounded-lg" />

  <section v-else class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div class="grid gap-4 md:grid-cols-2 md:gap-6">
      <AbilityScores :sheet="sheet" :items="items" @patch="handlePatch" />

      <SavingThrows :sheet="sheet" :items="items" @patch="handlePatch" />
    </div>

    <SheetSection>
      <div class="flex flex-col gap-4 md:flex-row md:gap-6">
        <HitDice
          :sheet="sheet"
          :character-class="character.character.characterClass"
          class="md:min-w-0 md:flex-1"
          @patch="handlePatch"
        />

        <Separator :orientation="separatorOrientation" />

        <Inspiration
          :inspiration="sheet.inspiration"
          class="md:min-w-0 md:flex-1"
          @patch="handlePatch"
        />

        <Separator :orientation="separatorOrientation" />

        <SheetActions class="md:min-w-0 md:flex-1" />
      </div>
    </SheetSection>
  </section>
</template>
