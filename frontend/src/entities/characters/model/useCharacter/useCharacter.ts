import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import {
  characterQueries,
  getCharacter as getCharacterRequest,
} from '@shared/api/characters';

import type { UseCharacterOptions } from './useCharacter.types';

const RETRIES = 2;

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
  });

  const isCharacterNotFound = computed(() => {
    return characterError.value?.status !== 404;
  });

  return {
    character,
    isFetchingCharacter,
    characterError,
    refetchCharacter,
    isCharacterNotFound,
  };
};
