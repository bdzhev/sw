import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  deleteCharacter as deleteCharacterRequest,
  characterQueries,
} from '@shared/api/characters';
import { getApiErrorMessage } from '@shared/lib/http';
import { useToast } from '@shared/lib/ui';

import type { CharactersCache } from './useDeleteCharacter.types';

export const useDeleteCharacter = () => {
  const qc = useQueryClient();
  const { showToast } = useToast();

  const { mutate: deleteCharacter, isPending: isDeletingCharacter } = useMutation({
    mutationFn: deleteCharacterRequest,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: characterQueries.characters() });

      const previous = qc.getQueryData<CharactersCache>(characterQueries.characters());

      qc.setQueryData(characterQueries.characters(), (old: CharactersCache) => {
        if (!old) return old;

        return {
          ...old,
          // Every page carries `total`, so it has to drop everywhere or the
          // create limit stays engaged until the refetch lands.
          pages: old.pages.map((page) => {
            return {
              ...page,
              items: page.items.filter((charInfo) => {
                return charInfo.id !== id;
              }),
              total: Math.max(0, page.total - 1),
            };
          }),
        };
      });

      return { previous };
    },

    onError: (error, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(characterQueries.characters(), context.previous);
      }

      showToast({
        title: 'Could not delete the character',
        description: getApiErrorMessage(error, 'Please try again.'),
        variant: 'error',
      });
    },

    /**
     * The optimistic removal leaves a short page behind and a stale `total`,
     * which stalls pagination and keeps the create limit engaged after a
     * delete. Refetching settles both.
     */
    onSettled: () => {
      qc.invalidateQueries({ queryKey: characterQueries.characters() });
    },
  });

  return { deleteCharacter, isDeletingCharacter };
};
