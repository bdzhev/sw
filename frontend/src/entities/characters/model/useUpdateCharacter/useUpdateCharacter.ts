import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  updateCharacter as updateCharacterRequest,
  characterQueries,
} from '@shared/api/characters';
import { getApiErrorMessage } from '@shared/lib/http';
import { useToast } from '@shared/lib/ui';

import type {
  CharacterDetailCache,
  CharactersCache,
  UseUpdateCharacterOptions,
} from './useUpdateCharacter.types';

export const useUpdateCharacter = (options?: UseUpdateCharacterOptions) => {
  const { onSuccess } = options || {};

  const qc = useQueryClient();
  const { showToast } = useToast();

  const { mutate: updateCharacter, isPending: isUpdating } = useMutation({
    mutationFn: updateCharacterRequest,
    onSuccess: (updated) => {
      qc.setQueryData(characterQueries.characters(), (old: CharactersCache) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          pages: old.pages.map((page) => {
            return {
              ...page,
              items: page.items.map((char) => {
                return char.id === updated.id ? { ...char, ...updated } : char;
              }),
            };
          }),
        };
      });

      /**
       * Also cached on its own key, which the sheet reads. Merged into
       * `character`, never assigned over the whole entry — that key holds the
       * full detail (sheet + sub-collections) and a plain assign would drop it.
       */
      qc.setQueryData(
        characterQueries.character(updated.id),
        (old: CharacterDetailCache) => {
          if (!old) {
            return old;
          }

          return { ...old, character: { ...old.character, ...updated } };
        },
      );

      onSuccess?.();
    },
    onError: (error) => {
      showToast({
        title: 'Could not save that change',
        description: getApiErrorMessage(error, 'Please try again.'),
        variant: 'error',
      });
    },
  });

  return { updateCharacter, isUpdating };
};
