import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ClassResource, Trait } from '@shared/api/characters';

import type { DetailPayload, PendingDelete } from './useTraitsUi.types';

/**
 * Which dialog is open, and what it is open *about*.
 *
 * A store rather than a composable because a composable is instantiated per
 * call: two components calling it would each get their own `isTraitDialogOpen`,
 * and the second one would silently do nothing. A row deep in the tree can also
 * open a dialog directly instead of emitting up through the list to the tab.
 *
 * Server state is deliberately absent — rows are derived from the TanStack cache
 * in `useTraitsTab`. Copying them here would be a second source of truth, which
 * is exactly what the autosave design exists to avoid.
 */
export const useTraitsUi = defineStore('traitsUi', () => {
  const isTraitDialogOpen = ref(false);
  const editedTrait = ref<Trait | null>(null);

  const isResourceDialogOpen = ref(false);
  const editedResource = ref<ClassResource | null>(null);

  const isDetailOpen = ref(false);
  const detail = ref<DetailPayload>({ title: '', description: null, meta: '' });

  const isDeleteOpen = ref(false);
  const pendingDelete = ref<PendingDelete>({
    kind: 'trait',
    rowId: '',
    name: '',
  });

  /** `null` means "add", a row means "edit" — the dialog reads which from this. */
  const openTraitDialog = (trait: Trait | null) => {
    editedTrait.value = trait;
    isTraitDialogOpen.value = true;
  };

  const openResourceDialog = (resource: ClassResource | null) => {
    editedResource.value = resource;
    isResourceDialogOpen.value = true;
  };

  const closeTraitDialog = () => {
    isTraitDialogOpen.value = false;
  };

  const closeResourceDialog = () => {
    isResourceDialogOpen.value = false;
  };

  const openDetail = (payload: DetailPayload) => {
    detail.value = payload;
    isDetailOpen.value = true;
  };

  const askDelete = (target: PendingDelete) => {
    pendingDelete.value = target;
    isDeleteOpen.value = true;
  };

  const closeDelete = () => {
    isDeleteOpen.value = false;
  };

  return {
    isTraitDialogOpen,
    editedTrait,
    isResourceDialogOpen,
    editedResource,
    isDetailOpen,
    detail,
    isDeleteOpen,
    pendingDelete,
    openTraitDialog,
    openResourceDialog,
    closeTraitDialog,
    closeResourceDialog,
    openDetail,
    askDelete,
    closeDelete,
  };
});
