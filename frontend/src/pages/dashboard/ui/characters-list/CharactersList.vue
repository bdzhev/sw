<script setup lang="ts">
import { useCharactersInfo } from '@entities/characters';

import {
  CharCardRoot,
  CharCardHeader,
  CharCardFooter,
  CoreInfoLine,
  CtaButton,
  CharacterCardSkeleton,
  DeleteActionItem,
  DropdownActionsList,
  EditActionItem,
} from '@features/character-card';

import { EmptyState } from './empty-state';

const SKELETON_CARD_COUNT = 4;

const { characters, isCharInfoLoading, isCharInfoRefetching } = useCharactersInfo();
</script>

<template>
  <div
    v-if="isCharInfoLoading"
    class="grid grid-cols-1 gap-4 page-x sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
  >
    <CharacterCardSkeleton class="min-h-50" v-for="n in SKELETON_CARD_COUNT" :key="n" />
  </div>

  <EmptyState v-else-if="!characters?.length" />

  <div
    v-else
    class="grid grid-cols-1 gap-4 page-x transition-opacity sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
    :class="{ 'opacity-60': isCharInfoRefetching }"
    id="characterInfoList"
  >
    <CharCardRoot
      v-for="char in characters"
      :key="char.id"
      v-bind="char"
      class="min-h-50"
    >
      <CharCardHeader>
        <CoreInfoLine label="Class" field="characterClass" />

        <CoreInfoLine label="Race" field="race" />
      </CharCardHeader>

      <CharCardFooter class="mt-auto">
        <div class="flex flex-row items-center justify-between">
          <DropdownActionsList>
            <DeleteActionItem />

            <EditActionItem />
          </DropdownActionsList>

          <CtaButton />
        </div>
      </CharCardFooter>
    </CharCardRoot>
  </div>
</template>
