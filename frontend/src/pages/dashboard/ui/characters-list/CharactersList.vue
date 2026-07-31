<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { useVirtualGrid } from '@shared/lib/ui';

import { useCharactersInfo } from '@entities/characters';

import { CharacterCardSkeleton } from '@features/character-card';

import { CharacterCard } from './character-card';
import { EmptyState } from './empty-state';

const SKELETON_CARD_COUNT = 4;

/** Card min-height plus the row gap; measureRow corrects it from the DOM. */
const ESTIMATED_ROW_HEIGHT = 216;

const ROW_CLASSES =
  'grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8';

const {
  characters,
  isCharInfoLoading,
  isCharInfoRefetching,
  isFetchingNextCharactersInfo,
  hasMoreCharactersInfo,
  loadNextCharactersInfo,
} = useCharactersInfo();

const listRef = useTemplateRef<HTMLElement>('list');

const { columns, visibleRows, totalHeight, measureRow } = useVirtualGrid({
  items: characters,
  container: listRef,
  estimatedRowHeight: ESTIMATED_ROW_HEIGHT,
  onEndReached: () => {
    if (hasMoreCharactersInfo.value && !isFetchingNextCharactersInfo.value) {
      loadNextCharactersInfo();
    }
  },
});
</script>

<template>
  <div v-if="isCharInfoLoading" :class="[ROW_CLASSES, 'page-x']">
    <CharacterCardSkeleton class="min-h-50" v-for="n in SKELETON_CARD_COUNT" :key="n" />
  </div>

  <EmptyState v-else-if="!characters.length" />

  <div
    v-else
    class="page-x transition-opacity"
    :class="{ 'opacity-60': isCharInfoRefetching }"
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
        :ref="measureRow"
        :data-index="row.index"
        :class="[ROW_CLASSES, 'absolute top-0 left-0 pb-4 lg:pb-8']"
        :style="{ transform: `translateY(${row.offset}px)` }"
      >
        <CharacterCard v-for="char in row.items" :key="char.id" :character="char" />
      </div>
    </div>

    <div v-if="isFetchingNextCharactersInfo" :class="ROW_CLASSES">
      <CharacterCardSkeleton class="min-h-50" v-for="n in columns" :key="`next-${n}`" />
    </div>
  </div>
</template>
