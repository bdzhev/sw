import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/vue-query';

import {
  updateCharacter as updateCharacterRequest,
  characterQueries,
  type CharacterData,
} from '@shared/api/characters';

import type { UseUpdateCharacterOptions } from './useUpdateCharacter.types';

export const useUpdateCharacter = (options?: UseUpdateCharacterOptions) => {
  const { onSuccess } = options || {};

  const qc = useQueryClient();

  const { mutate: updateCharacter, isPending: isUpdating } = useMutation({
    mutationFn: updateCharacterRequest,
    onSuccess: (resp) => {
      const updated = resp;
      qc.setQueryData(
        characterQueries.characters(),
        (old: InfiniteData<CharacterData[]> | undefined) => {
          if (!old) return old;
          const updatedPages = old.pages.map((page) => {
            return page.map((char) => {
              return char.id === updated.id ? { ...char, ...updated } : char;
            });
          });

          return { ...old, pages: updatedPages };
        },
      );
      onSuccess?.();
    },
  });

  return { updateCharacter, isUpdating };
};
