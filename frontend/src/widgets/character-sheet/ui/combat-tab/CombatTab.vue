<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { CollectionKey } from '@shared/api/characters';
import type { Attack } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';
import { Text } from '@shared/ui/text';

import {
  useCharacter,
  useCharacterCollection,
  useSheetAutosave,
} from '@entities/characters';

import type { AttackBody } from '@widgets/character-sheet/config/combat';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { AttackDetailDialog } from './attack-detail-dialog';
import { AttackDialog } from './attack-dialog';
import { AttackRow } from './attack-row';
import { InitiativePanel } from './initiative-panel';

const route = useRoute();
const id = route.params.id as string;

const { character } = useCharacter({ id });
const attacks = useCharacterCollection(CollectionKey.ATTACKS, { characterId: id });
const autosave = useSheetAutosave();

const sheet = computed(() => {
  return character.value?.sheet ?? null;
});

/** Already in the player's own sort order, straight off the cached detail. */
const rows = computed(() => {
  return character.value?.attacks ?? [];
});

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

const isWriting = computed(() => {
  return attacks.isCreating.value || attacks.isUpdating.value;
});

const isFormOpen = ref(false);
const isDetailOpen = ref(false);
const isDeleteOpen = ref(false);
const selected = ref<Attack | null>(null);

const handleInitiativeBonus = (bonus: number): void => {
  autosave.patchSheet({ initiativeBonus: bonus });
};

const handleAddClick = (): void => {
  selected.value = null;
  isFormOpen.value = true;
};

const handleDetail = (attack: Attack): void => {
  selected.value = attack;
  isDetailOpen.value = true;
};

const handleEdit = (): void => {
  isDetailOpen.value = false;
  isFormOpen.value = true;
};

const handleRemove = (): void => {
  isDetailOpen.value = false;
  isDeleteOpen.value = true;
};

const handleSubmitAttack = async (body: AttackBody): Promise<void> => {
  const editing = selected.value;

  try {
    if (editing) {
      await attacks.updateRow({ rowId: editing.id, patch: body });
    } else {
      await attacks.createRow(body);
    }
  } catch {
    return;
  }

  isFormOpen.value = false;
  selected.value = null;
};

const handleConfirmDelete = async (): Promise<void> => {
  const target = selected.value;

  if (!target) {
    return;
  }

  try {
    await attacks.deleteRow(target.id);
  } catch {
    return;
  }

  isDeleteOpen.value = false;
  selected.value = null;
};

/**
 * The pin the quick-access overlay reads. Only the flag is written here — the
 * overlay owns `pinOrder`.
 */
const handleTogglePin = async (attack: Attack): Promise<void> => {
  try {
    await attacks.updateRow({
      rowId: attack.id,
      patch: { quickReference: !attack.quickReference },
    });
  } catch {
    return;
  }
};

const handleUpdateAmmo = async (attack: Attack, value: number): Promise<void> => {
  try {
    await attacks.updateRow({ rowId: attack.id, patch: { ammoRemaining: value } });
  } catch {
    return;
  }
};
</script>

<template>
  <section v-if="sheet" class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <InitiativePanel
      :sheet="sheet"
      :items="items"
      @update:bonus="handleInitiativeBonus"
    />

    <SheetSection title="Attacks" variant="plain">
      <template #actions>
        <Button size="sm" @click="handleAddClick">
          <Plus :size="16" class="mr-1" aria-hidden="true" />

          Add attack
        </Button>
      </template>

      <Text v-if="!rows.length" theme="secondary">
        No attacks yet. Add a weapon, an unarmed strike or a natural weapon.
      </Text>

      <ul v-else class="flex flex-col gap-2">
        <AttackRow
          v-for="attack in rows"
          :key="attack.id"
          :attack="attack"
          :sheet="sheet"
          :items="items"
          :is-busy="isWriting"
          @detail="handleDetail"
          @toggle-pin="handleTogglePin"
          @update-ammo="handleUpdateAmmo"
        />
      </ul>
    </SheetSection>

    <AttackDialog
      v-model:open="isFormOpen"
      :attack="selected"
      :sheet="sheet"
      :items="items"
      :is-saving="isWriting"
      @submit="handleSubmitAttack"
    />

    <AttackDetailDialog
      v-model:open="isDetailOpen"
      :attack="selected"
      :sheet="sheet"
      :items="items"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <DialogRoot v-model:open="isDeleteOpen">
      <ConfirmDialog
        action-type="negative"
        :dialog-title="`Delete ${selected?.name ?? 'this attack'}?`"
        dialog-description="The attack is removed from this sheet. This cannot be undone."
        confirm-button-text="Delete"
        :is-loading="attacks.isDeleting.value"
        :on-confirm="handleConfirmDelete"
      />
    </DialogRoot>
  </section>
</template>
