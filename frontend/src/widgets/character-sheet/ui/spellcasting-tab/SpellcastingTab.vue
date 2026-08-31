<script setup lang="ts">
import { computed, ref } from 'vue';

import type { CharacterSpell } from '@shared/api/characters';
import type { SpellReference } from '@shared/api/spells';
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';
import { Skeleton } from '@shared/ui/skeleton';

import { useSpellcastingTab } from '@widgets/character-sheet/model/spellcasting';
import type { SpellSubmitValues } from '@widgets/character-sheet/model/spellcasting';

import { AddSpellDialog } from './add-spell-dialog';
import { CastDialog } from './cast-dialog';
import { SpellDetailDialog } from './spell-detail-dialog';
import { SpellList } from './spell-list';
import { SpellSlots } from './spell-slots';
import { SpellcastingStats } from './spellcasting-stats';

/**
 * Dialog state is local refs rather than a store: every row here emits what it
 * acted on, so there is nothing a singleton would have to hold.
 */
const {
  sheet,
  characterClass,
  allSpells,
  progression,
  isPactMagic,
  castingAbility,
  saveDc,
  attackBonus,
  tableMaxima,
  maxCastableLevel,
  addedSpellIds,
  isSavingSpell,
  patchSheet: handlePatch,
  castAtLevel,
  addSpell,
  deleteSpell,
} = useSpellcastingTab();

const isAddOpen = ref(false);
const isDetailOpen = ref(false);
const isCastOpen = ref(false);
const isDeleteOpen = ref(false);

const detailSpell = ref<CharacterSpell | null>(null);
const castSpell = ref<CharacterSpell | null>(null);
const pendingDelete = ref<CharacterSpell | null>(null);

const spellName = (spell: CharacterSpell | null): string => {
  return spell?.spell?.name ?? spell?.customName ?? 'this spell';
};

const castSpellName = computed(() => {
  return spellName(castSpell.value);
});

/** A reference spell's level comes off the join; a custom one carries its own. */
const castSpellLevel = computed(() => {
  return castSpell.value?.spell?.level ?? castSpell.value?.customLevel ?? null;
});

const pendingDeleteName = computed(() => {
  return spellName(pendingDelete.value);
});

const handleAddClick = (): void => {
  isAddOpen.value = true;
};

const handleOpenDetail = (spell: CharacterSpell): void => {
  detailSpell.value = spell;
  isDetailOpen.value = true;
};

const handleCast = (spell: CharacterSpell): void => {
  castSpell.value = spell;
  isCastOpen.value = true;
};

const handleCastAtLevel = (slotLevel: number): void => {
  castAtLevel(slotLevel);
};

const handleRemove = (spell: CharacterSpell): void => {
  pendingDelete.value = spell;
  isDeleteOpen.value = true;
};

const handleConfirmDelete = async (): Promise<void> => {
  const spell = pendingDelete.value;

  if (!spell) return;

  if (await deleteSpell(spell.id)) {
    isDeleteOpen.value = false;
  }
};

const handleAddReference = async (spell: SpellReference): Promise<void> => {
  await addSpell({ spellId: spell.id });
};

/** Freeform closes the dialog; a library add leaves it open to pick another. */
const handleAddCustom = async (values: SpellSubmitValues): Promise<void> => {
  if (await addSpell(values)) {
    isAddOpen.value = false;
  }
};
</script>

<template>
  <!-- Skeleton hardcodes `h-full w-full`, so its size has to come from a wrapper. -->
  <div v-if="!sheet" class="h-96 w-full">
    <Skeleton class="rounded-lg" />
  </div>

  <section v-else class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <SpellcastingStats
      :ability="castingAbility"
      :save-dc="saveDc"
      :attack-bonus="attackBonus"
      :progression="progression"
      @patch="handlePatch"
    />

    <SpellSlots
      :slots="sheet.spellSlots"
      :is-pact-magic="isPactMagic"
      :table-maxima="tableMaxima"
      @patch="handlePatch"
    />

    <SpellList
      :spells="allSpells"
      :slots="sheet.spellSlots"
      :is-saving="isSavingSpell"
      @add="handleAddClick"
      @open="handleOpenDetail"
      @cast="handleCast"
      @remove="handleRemove"
    />

    <AddSpellDialog
      v-model:open="isAddOpen"
      :character-class="characterClass"
      :max-castable-level="maxCastableLevel"
      :added-spell-ids="addedSpellIds"
      :is-saving="isSavingSpell"
      @add-reference="handleAddReference"
      @add-custom="handleAddCustom"
    />

    <SpellDetailDialog v-model:open="isDetailOpen" :spell="detailSpell" />

    <CastDialog
      v-model:open="isCastOpen"
      :spell-name="castSpellName"
      :spell-level="castSpellLevel"
      :slots="sheet.spellSlots"
      @cast="handleCastAtLevel"
    />

    <DialogRoot v-model:open="isDeleteOpen">
      <ConfirmDialog
        action-type="negative"
        :dialog-title="`Remove ${pendingDeleteName}?`"
        dialog-description="This takes it off your list. There is no undo."
        confirm-button-text="Remove"
        :is-loading="isSavingSpell"
        :on-confirm="handleConfirmDelete"
      />
    </DialogRoot>
  </section>
</template>
