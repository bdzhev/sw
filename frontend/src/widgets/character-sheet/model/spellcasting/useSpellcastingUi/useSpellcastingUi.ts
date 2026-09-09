import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { CharacterSpell } from '@shared/api/characters';

/**
 * Which dialog is open, and what it is open *about*.
 *
 * A store rather than local refs so a spell row can open the cast or detail
 * dialog without the tab re-rendering to pass the state down — the row writes
 * here and only the dialog reads it. Same reasoning as `useTraitsUi`.
 *
 * Server state is deliberately absent: spells are derived from the TanStack
 * cache in `useSpellcastingTab`. Copying them here would be a second source of
 * truth.
 */
export const useSpellcastingUi = defineStore('spellcastingUi', () => {
  const isAddOpen = ref(false);

  const isDetailOpen = ref(false);
  const detailSpell = ref<CharacterSpell | null>(null);

  const isCastOpen = ref(false);
  const castSpell = ref<CharacterSpell | null>(null);

  const isDeleteOpen = ref(false);
  const pendingDelete = ref<CharacterSpell | null>(null);

  const openAdd = (): void => {
    isAddOpen.value = true;
  };

  /** Closed by the tab once a *custom* add succeeds; a library add stays open. */
  const closeAdd = (): void => {
    isAddOpen.value = false;
  };

  const openDetail = (spell: CharacterSpell): void => {
    detailSpell.value = spell;
    isDetailOpen.value = true;
  };

  const openCast = (spell: CharacterSpell): void => {
    castSpell.value = spell;
    isCastOpen.value = true;
  };

  const askDelete = (spell: CharacterSpell): void => {
    pendingDelete.value = spell;
    isDeleteOpen.value = true;
  };

  const closeDelete = (): void => {
    isDeleteOpen.value = false;
  };

  /**
   * A store outlives the tab, and `v-model:open` binds straight to these refs,
   * so leaving a dialog open and navigating away would bring it back on return.
   * Cleared on unmount; see `useSpellcastingTab`.
   */
  const reset = (): void => {
    isAddOpen.value = false;
    isDetailOpen.value = false;
    detailSpell.value = null;
    isCastOpen.value = false;
    castSpell.value = null;
    isDeleteOpen.value = false;
    pendingDelete.value = null;
  };

  return {
    isAddOpen,
    isDetailOpen,
    detailSpell,
    isCastOpen,
    castSpell,
    isDeleteOpen,
    pendingDelete,
    openAdd,
    closeAdd,
    openDetail,
    openCast,
    askDelete,
    closeDelete,
    reset,
  };
});
