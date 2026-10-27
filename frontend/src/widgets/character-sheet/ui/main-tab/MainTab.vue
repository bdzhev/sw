<script setup lang="ts">
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { useBreakpoint } from '@shared/lib/ui';
import { Separator } from '@shared/ui/separator';
import { Skeleton } from '@shared/ui/skeleton';

import { proficiencyBonus } from '@entities/characters';

import { useAbilityTotals } from '@widgets/character-sheet/model/abilities';
import { useSheetContext } from '@widgets/character-sheet/model/sheet-shell';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { AbilityScores } from './ability-scores';
import { HitDice } from './hit-dice';
import { Inspiration } from './inspiration';
import { SavingThrows } from './saving-throws';
import { SheetActions } from './sheet-actions';

const { isMobile } = useBreakpoint();

const { character, sheet, patchSheet } = useSheetContext();
/** The event handler; the seam itself is a method, so the component names this. */
const handlePatch = (patch: SheetPatch, immediate = false): void => {
  patchSheet(patch, immediate);
};

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

/** The one item scan for this tab; both children read its result. */
const { rawScores, totals } = useAbilityTotals({ sheet, items });

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
