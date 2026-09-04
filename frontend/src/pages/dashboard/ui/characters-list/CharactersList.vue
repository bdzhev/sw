<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { useBreakpoint, useVirtualGrid } from '@shared/lib/ui';

import { useCharacterSummaries } from '@entities/characters';

import { CharacterCardSkeleton } from '@features/character-card';

import { CharacterCard } from './character-card';
import { EmptyState } from './empty-state';

const SKELETON_CARD_COUNT = 4;

const ROW_HEIGHT = 216;
const ROW_HEIGHT_LG = 232;

const ROW_CLASSES =
  'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8';

const {
  characters,
  isLoadingCharacterSummaries,
  isRefetchingCharacterSummaries,
  isFetchingNextCharacterSummaries,
  hasMoreCharacterSummaries,
  loadNextCharacterSummaries,
} = useCharacterSummaries();

const { isDesktop } = useBreakpoint();

const listRef = useTemplateRef<HTMLElement>('list');
const sentinelRef = useTemplateRef<HTMLElement>('sentinel');

const { columns, visibleRows, totalHeight } = useVirtualGrid({
  items: characters,
  container: listRef,
  sentinel: sentinelRef,
  rowHeight: () => {
    return isDesktop.value ? ROW_HEIGHT_LG : ROW_HEIGHT;
  },
  onEndReached: () => {
    if (hasMoreCharacterSummaries.value && !isFetchingNextCharacterSummaries.value) {
      loadNextCharacterSummaries();
    }
  },
});
</script>

<template>
  <div v-if="isLoadingCharacterSummaries" :class="[ROW_CLASSES, 'page-x']">
    <CharacterCardSkeleton class="h-50" v-for="n in SKELETON_CARD_COUNT" :key="n" />
  </div>

  <EmptyState v-else-if="!characters.length" />

  <div
    v-else
    class="page-x transition-opacity"
    :class="{ 'opacity-60': isRefetchingCharacterSummaries }"
  >
    <div
      ref="list"
      class="relative w-full"
      :style="{ height: `${totalHeight}px` }"
      id="characterInfoList"
    >
      <div
        v-for="row in visibleRows"
        :key="row.index"
        :class="[ROW_CLASSES, 'absolute top-0 left-0 pb-4 lg:pb-8']"
        :style="{ transform: `translateY(${row.offset}px)` }"
      >
        <CharacterCard v-for="char in row.items" :key="char.id" :character="char" />
      </div>
    </div>

    <div ref="sentinel" aria-hidden="true" class="h-px w-full" />

    <div v-if="isFetchingNextCharacterSummaries" :class="ROW_CLASSES">
      <CharacterCardSkeleton class="h-50" v-for="n in columns" :key="`next-${n}`" />
    </div>
  </div>
</template>
