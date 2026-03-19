import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/vue-query';

import {
  deleteCharacter as deleteCharacterRequest,
  characterQueries,
  type CharacterData,
} from '@shared/api/characters';

export const useDeleteCharacter = () => {
  const qc = useQueryClient();

  const { mutate: deleteCharacter, isPending: isDeletingCharacter } =
    useMutation({
      mutationFn: deleteCharacterRequest,
      onMutate: async (id: string) => {
        await qc.cancelQueries({ queryKey: characterQueries.characters() });

        const previous = qc.getQueryData(characterQueries.characters());

        qc.setQueryData(
          characterQueries.characters(),
          (old: InfiniteData<CharacterData[]>) => {
            if (!old) return old;
            const pagesFiltered = old.pages.map((page) =>
              page.filter((charInfo) => charInfo.id !== id),
            );
            return { ...old, pages: pagesFiltered };
          },
        );

        return { previous };
      },

      onError: (_err, _id, context) => {
        if (context?.previous) {
          qc.setQueryData(characterQueries.characters(), context.previous);
        }
      },
    });

  return { deleteCharacter, isDeletingCharacter };
};
