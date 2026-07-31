import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  updateCharacter as updateCharacterRequest,
  characterQueries,
} from '@shared/api/characters';

import type {
  CharactersCache,
  UseUpdateCharacterOptions,
} from './useUpdateCharacter.types';

export const useUpdateCharacter = (options?: UseUpdateCharacterOptions) => {
  const { onSuccess } = options || {};

  const qc = useQueryClient();

  const { mutate: updateCharacter, isPending: isUpdating } = useMutation({
    mutationFn: updateCharacterRequest,
    onSuccess: (updated) => {
      qc.setQueryData(characterQueries.characters(), (old: CharactersCache) => {
        if (!old) return old;

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

      /** Also cached on its own key, which the sheet reads. */
      qc.setQueryData(characterQueries.character(updated.id), updated);

      onSuccess?.();
    },
  });

  return { updateCharacter, isUpdating };
};
