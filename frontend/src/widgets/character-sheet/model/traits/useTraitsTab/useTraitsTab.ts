import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { CollectionKey } from '@shared/api/characters';
import type { ClassResource, Trait } from '@shared/api/characters';

import { useCharacter, useCharacterCollection } from '@entities/characters';

import type { ResourceSubmitValues } from '../useResourceForm';
import type { TraitSubmitValues } from '../useTraitForm';
import { useTraitsUi } from '../useTraitsUi';

const byPinOrder = <T extends { pinOrder: number }>(rows: T[]): T[] => {
  return [...rows].sort((first, second) => {
    return first.pinOrder - second.pinOrder;
  });
};

/**
 * The data half of the traits tab: rows derived from the cached sheet, and the
 * writes. Dialog state lives in `useTraitsUi`, which is a store because it has
 * to be a singleton — see the note there.
 */
export const useTraitsTab = () => {
  const route = useRoute();
  const ui = useTraitsUi();

  const characterId = computed(() => {
    return route.params.id as string;
  });

  const { character } = useCharacter({ id: characterId.value });

  const traits = useCharacterCollection(CollectionKey.TRAITS, {
    characterId: characterId.value,
  });
  const resources = useCharacterCollection(CollectionKey.CLASS_RESOURCES, {
    characterId: characterId.value,
  });

  const allTraits = computed(() => {
    return character.value?.traits ?? [];
  });

  const allResources = computed(() => {
    return character.value?.classResources ?? [];
  });

  /** A pinned row lives in the strip instead of the list below, never in both. */
  const pinnedTraits = computed(() => {
    return byPinOrder(
      allTraits.value.filter((trait) => {
        return trait.quickReference;
      }),
    );
  });

  const pinnedResources = computed(() => {
    return byPinOrder(
      allResources.value.filter((resource) => {
        return resource.quickReference;
      }),
    );
  });

  const listedTraits = computed(() => {
    return allTraits.value.filter((trait) => {
      return !trait.quickReference;
    });
  });

  const listedResources = computed(() => {
    return allResources.value.filter((resource) => {
      return !resource.quickReference;
    });
  });

  const isSavingTrait = computed(() => {
    return traits.isCreating.value || traits.isUpdating.value || traits.isDeleting.value;
  });

  const isSavingResource = computed(() => {
    return (
      resources.isCreating.value ||
      resources.isUpdating.value ||
      resources.isDeleting.value
    );
  });

  const confirmDelete = async () => {
    const { kind, rowId } = ui.pendingDelete;

    try {
      await (kind === 'trait' ? traits.deleteRow(rowId) : resources.deleteRow(rowId));
    } catch {
      return;
    }

    ui.closeDelete();
  };

  const submitTrait = async (values: TraitSubmitValues) => {
    const edited = ui.editedTrait;

    try {
      if (edited) {
        await traits.updateRow({ rowId: edited.id, patch: values });
      } else {
        await traits.createRow(values);
      }
    } catch {
      return;
    }

    ui.closeTraitDialog();
  };

  const submitResource = async (values: ResourceSubmitValues) => {
    const edited = ui.editedResource;

    try {
      if (edited) {
        await resources.updateRow({ rowId: edited.id, patch: values });
      } else {
        await resources.createRow(values);
      }
    } catch {
      return;
    }

    ui.closeResourceDialog();
  };

  const toggleTraitPin = (trait: Trait) => {
    void traits.updateRow({
      rowId: trait.id,
      patch: { quickReference: !trait.quickReference },
    });
  };

  const toggleResourcePin = (resource: ClassResource) => {
    void resources.updateRow({
      rowId: resource.id,
      patch: { quickReference: !resource.quickReference },
    });
  };

  /**
   * `current` is a counter, so the plan wants it on the autosave channel — but the
   * only `AutosaveTarget` today is `character`, and inventing a sub-entity target
   * is not this tab's call. Absolute value, never a delta, so the move is a
   * one-line change once that target exists.
   */
  const spendResource = (resource: ClassResource, amount: number) => {
    const next = Math.max(0, resource.current - amount);

    if (next === resource.current) return;

    void resources.updateRow({ rowId: resource.id, patch: { current: next } });
  };

  const {
    isTraitDialogOpen,
    editedTrait,
    isResourceDialogOpen,
    editedResource,
    isDetailOpen,
    detail,
    isDeleteOpen,
    pendingDelete,
  } = storeToRefs(ui);

  return {
    pinnedTraits,
    pinnedResources,
    listedTraits,
    listedResources,
    isSavingTrait,
    isSavingResource,
    isTraitDialogOpen,
    editedTrait,
    isResourceDialogOpen,
    editedResource,
    isDetailOpen,
    detail,
    isDeleteOpen,
    pendingDelete,
    confirmDelete,
    submitTrait,
    submitResource,
    toggleTraitPin,
    toggleResourcePin,
    spendResource,
  };
};
