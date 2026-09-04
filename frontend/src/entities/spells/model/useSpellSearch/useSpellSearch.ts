import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, type Ref } from 'vue';

import { searchSpells, spellQueries } from '@shared/api/spells';
import type { SpellSearchFilters } from '@shared/api/spells';

/**
 * Search is submitted, not typed into: `filters` is null until the player
 * presses the button, and the query stays disabled until then. That is also
 * why the library is never fetched just because a dialog opened.
 */
export const useSpellSearch = (filters: Ref<SpellSearchFilters | null>) => {
  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: computed(() => {
        return spellQueries.search(filters.value ?? {});
      }),
      queryFn: ({ pageParam }) => {
        return searchSpells({ ...filters.value, offset: pageParam });
      },
      /** Rows held, not `pages.length * PAGE_SIZE` — `total` makes "is there more" exact. */
      getNextPageParam: (lastPage, pages) => {
        const loaded = pages.reduce((count, page) => {
          return count + page.items.length;
        }, 0);

        return loaded < lastPage.total ? loaded : undefined;
      },
      initialPageParam: 0,
      enabled: computed(() => {
        return filters.value !== null;
      }),
      staleTime: Infinity,
    });

  const spells = computed(() => {
    return (
      data.value?.pages.flatMap((page) => {
        return page.items;
      }) ?? []
    );
  });

  const spellsTotal = computed(() => {
    const pages = data.value?.pages ?? [];

    return pages[pages.length - 1]?.total ?? 0;
  });

  /** "No results" only once a search has actually run — not before the first one. */
  const hasNoResults = computed(() => {
    return (
      filters.value !== null &&
      !isFetching.value &&
      data.value !== undefined &&
      spells.value.length === 0
    );
  });

  return {
    spells,
    spellsTotal,
    hasNoResults,
    isLoadingSpells: isLoading,
    isFetchingSpells: isFetching,
    isFetchingNextSpells: isFetchingNextPage,
    hasMoreSpells: hasNextPage,
    loadNextSpells: fetchNextPage,
  };
};
