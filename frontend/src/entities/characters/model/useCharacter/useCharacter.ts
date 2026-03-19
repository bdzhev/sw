import { useQuery } from '@tanstack/vue-query';

import {
  characterQueries,
  getCharacter as getCharacterRequest,
} from '@shared/api/characters';

const RETRIES = 2;

export const useCharacter = (id: string) => {
  const {
    data: character,
    isFetching: isCharacterFetching,
    error: characterError,
  } = useQuery({
    queryKey: characterQueries.character(id),
    queryFn: async () => {
      return await getCharacterRequest(id);
    },
    retry: RETRIES,
  });

  return { character, isCharacterFetching, characterError };
};
