import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import {
  getCharactersInfo,
  characterQueries,
  MAX_CHARACTERS,
} from '@shared/api/characters';

export const useCharactersInfo = () => {
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: characterQueries.characters(),
    queryFn: ({ pageParam }) => {
      return getCharactersInfo(pageParam);
    },
    /**
     * The next offset is how many rows are actually held, not
     * `pages.length * PAGE_SIZE` — those diverge as soon as a page is mutated
     * in place by an optimistic delete, which then skips rows. `total` also
     * makes "is there more" exact instead of inferred from a short last page.
     */
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((count, page) => {
        return count + page.items.length;
      }, 0);

      return loaded < lastPage.total ? loaded : undefined;
    },
    initialPageParam: 0,
    placeholderData: (previousData) => {
      return previousData;
    },
    staleTime: Infinity,
  });

  const characters = computed(() => {
    return (
      data.value?.pages.flatMap((page) => {
        return page.items;
      }) ?? []
    );
  });

  const charactersTotal = computed(() => {
    const pages = data.value?.pages ?? [];

    return pages[pages.length - 1]?.total ?? 0;
  });

  const isAtCharacterLimit = computed(() => {
    return charactersTotal.value >= MAX_CHARACTERS;
  });

  return {
    characters,
    charactersTotal,
    isAtCharacterLimit,
    isCharInfoLoading: isLoading,
    isCharInfoRefetching: isRefetching,
    isFetchingNextCharactersInfo: isFetchingNextPage,
    hasMoreCharactersInfo: hasNextPage,
    loadNextCharactersInfo: fetchNextPage,
  };
};
