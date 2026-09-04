import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import {
  characterQueries,
  getCharacter as getCharacterRequest,
} from '@shared/api/characters';

import type { UseCharacterOptions } from './useCharacter.types';

const RETRIES = 2;
const NOT_FOUND = 404;

export const useCharacter = (options: UseCharacterOptions) => {
  const { id, shouldRefetchOnMount = false } = options;

  const {
    data: character,
    isFetching: isFetchingCharacter,
    refetch: refetchCharacter,
    error: characterError,
  } = useQuery({
    queryKey: characterQueries.character(id),
    queryFn: async () => {
      return await getCharacterRequest(id);
    },
    refetchOnMount: shouldRefetchOnMount,
    retry: RETRIES,
    /**
     * vue-query wraps query state in a deep `readonly()` by default, so every read
     * of a nested value - and the sheet detail nests five row arrays plus four jsonb
     * objects - goes through a readonly proxy. Safe to make shallow because nothing
     * mutates cached data in place: this store and `useCharacterCollection` both
     * write whole new objects through `setQueryData`.
     */
    shallow: true,
  });

  const isCharacterNotFound = computed(() => {
    return characterError.value?.status === NOT_FOUND;
  });

  return {
    character,
    isFetchingCharacter,
    characterError,
    refetchCharacter,
    isCharacterNotFound,
  };
};
