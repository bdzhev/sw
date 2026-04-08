import { useInfiniteQuery } from "@tanstack/vue-query";
import { computed } from "vue";

import {
  getCharactersInfo,
  characterQueries,
  PAGE_SIZE,
} from "@shared/api/characters";

export const useCharactersInfo = () => {
  const { data, isLoading, isRefetching, fetchNextPage } = useInfiniteQuery({
    queryKey: characterQueries.characters(),
    queryFn: ({ pageParam }) => {
      return getCharactersInfo(pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }

      return pages.length * PAGE_SIZE;
    },
    initialPageParam: 0,
    placeholderData: (previousData) => {
      return previousData;
    },
    staleTime: Infinity,
  });

  const characters = computed(() => {
    return data.value?.pages.flat() ?? [];
  });

  return {
    characters,
    isCharInfoLoading: isLoading,
    isCharInfoRefetching: isRefetching,
    loadNextCharactersInfo: fetchNextPage,
  };
};
