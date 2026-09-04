<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { useBreakpoint } from '@shared/lib/ui';
import { Separator } from '@shared/ui/separator';
import { Skeleton } from '@shared/ui/skeleton';

import { proficiencyBonus, useCharacter, useSheetAutosave } from '@entities/characters';

import { useAbilityTotals } from '@widgets/character-sheet/model/abilities';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { AbilityScores } from './ability-scores';
import { HitDice } from './hit-dice';
import { Inspiration } from './inspiration';
import { SavingThrows } from './saving-throws';
import { SheetActions } from './sheet-actions';

const { isMobile } = useBreakpoint();

const route = useRoute(RouteName.APP_CHARACTER);
const id = route.params.id;

const { character } = useCharacter({ id });
const autosave = useSheetAutosave();

const sheet = computed(() => {
  return character.value?.sheet;
});

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

/** The one item scan for this tab; both children read its result. */
const { rawScores, totals } = useAbilityTotals({ sheet, items });

const handlePatch = (patch: SheetPatch, immediate = false) => {
  autosave.patchSheet(patch, immediate);
};

/** The row becomes a column below md, and a rule has to turn with it. */
const separatorOrientation = computed(() => {
  return isMobile.value ? 'horizontal' : 'vertical';
});
</script>

<template>
  <div v-if="!sheet || !character" class="h-96 w-full">
    <Skeleton class="rounded-lg" />
  </div>

  <section v-else class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div class="grid gap-4 md:grid-cols-2 md:gap-6">
      <AbilityScores :raw-scores="rawScores" :totals="totals" @patch="handlePatch" />

      <SavingThrows
        :totals="totals"
        :proficiency-bonus="proficiencyBonus(sheet)"
        :save-proficiencies="sheet.saveProficiencies"
        :level="sheet.level"
        @patch="handlePatch"
      />
    </div>

    <SheetSection>
      <div class="flex flex-col gap-4 md:gap-6">
        <div class="flex flex-col gap-4 md:flex-row md:gap-6">
          <HitDice
            :level="sheet.level"
            :hit-dice-remaining="sheet.hitDiceRemaining"
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
        </div>

        <!-- Always horizontal: the actions own the row under the pair, at every width. -->
        <Separator orientation="horizontal" />

        <SheetActions />
      </div>
    </SheetSection>
  </section>
</template>
