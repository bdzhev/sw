import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  characterQueries,
  createCollectionRow,
  deleteCollectionRow,
  updateCollectionRow,
  type CollectionCreate,
  type CollectionKey,
  type CollectionRow,
} from '@shared/api/characters';
import { getApiErrorMessage } from '@shared/lib/http';
import { useToast } from '@shared/lib/ui';

import type {
  CharacterDetailCache,
  UpdateRowVariables,
  UseCharacterCollectionOptions,
} from './useCharacterCollection.types';

/**
 * CRUD for one of the five per-character sub-collections.
 *
 * Deliberately not a query: `GET /character/:id` already returns all five, so a
 * tab reads its rows straight off the cached detail and only mutates here. Each
 * mutation patches that same cache entry rather than invalidating it — an
 * invalidate would refetch the whole sheet (seven queries) to add one row, and
 * would blank the tab for a frame mid-combat.
 *
 * These are **entity CRUD**, the explicit-save channel — not autosave. The
 * counters that autosave (a resource's `current`, an item's `usesRemaining`) go
 * through the autosave controller instead, so they stay debounced and
 * single-flighted. Do not route a counter through here.
 */
export const useCharacterCollection = <K extends CollectionKey>(
  key: K,
  options: UseCharacterCollectionOptions,
) => {
  const { characterId } = options;

  const qc = useQueryClient();
  const { showToast } = useToast();

  const queryKey = characterQueries.character(characterId);

  const patchCache = (apply: (rows: CollectionRow[K][]) => CollectionRow[K][]) => {
    qc.setQueryData(queryKey, (old: CharacterDetailCache) => {
      if (!old) {
        return old;
      }

      return { ...old, [key]: apply(old[key] as CollectionRow[K][]) };
    });
  };

  const toastFailure = (action: string, error: unknown) => {
    showToast({
      title: `Could not ${action}`,
      description: getApiErrorMessage(error, 'Please try again.'),
      variant: 'error',
    });
  };

  const { mutateAsync: createRow, isPending: isCreating } = useMutation({
    mutationFn: (body: CollectionCreate<K>) => {
      return createCollectionRow(key, characterId, body);
    },
    // Appended, not prepended: every collection is rendered in the player's own
    // sort_order, and a new row defaults to the end.
    onSuccess: (created) => {
      patchCache((rows) => {
        return [...rows, created];
      });
    },
    onError: (error) => {
      toastFailure('add that', error);
    },
  });

  const { mutateAsync: updateRow, isPending: isUpdating } = useMutation({
    mutationFn: ({ rowId, patch }: UpdateRowVariables<K>) => {
      return updateCollectionRow(key, characterId, rowId, patch);
    },
    onSuccess: (updated) => {
      patchCache((rows) => {
        return rows.map((row) => {
          return row.id === updated.id ? updated : row;
        });
      });
    },
    onError: (error) => {
      toastFailure('save that change', error);
    },
  });

  const { mutateAsync: deleteRow, isPending: isDeleting } = useMutation({
    mutationFn: (rowId: string) => {
      return deleteCollectionRow(key, characterId, rowId);
    },
    // Removed on ack rather than optimistically: a delete has no undo here, and
    // a row vanishing then reappearing on failure reads worse than a short wait.
    onSuccess: (_result, rowId) => {
      patchCache((rows) => {
        return rows.filter((row) => {
          return row.id !== rowId;
        });
      });
    },
    onError: (error) => {
      toastFailure('delete that', error);
    },
  });

  return {
    createRow,
    updateRow,
    deleteRow,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
