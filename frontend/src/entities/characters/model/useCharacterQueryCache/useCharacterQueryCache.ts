import { useQueryClient, type InfiniteData } from "@tanstack/vue-query";

import { characterQueries, type CharacterData } from "@shared/api/characters";

export const useCharacterQueryCache = () => {
  const qc = useQueryClient();

  /**
   * TODO - fix the types. The infinite list doesnt have any stats.
   */
  const updateCharacterCache = (
    id: string,
    data: Partial<CharacterData>,
  ): void => {
    qc.setQueryData(
      characterQueries.characters(),
      (old: InfiniteData<CharacterData[]>) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => {
            return page.map((char) => {
              return char.id === id ? { ...char, ...data } : char;
            });
          }),
        };
      },
    );

    qc.setQueryData(characterQueries.character(id), (old: CharacterData) => {
      if (!old) return old;

      return { ...old, ...data };
    });
  };

  return { updateCharacterCache };
};
