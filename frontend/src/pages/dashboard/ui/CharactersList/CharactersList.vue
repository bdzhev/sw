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

const SKELETON_CARD_COUNT = 4;

const { characters, isCharInfoLoading, isCharInfoRefetching } =
  useCharactersInfo();
</script>

<template>
  <div v-if="isCharInfoLoading" class="row-auto grid grid-cols-2 gap-8 px-10">
    <CharacterCardSkeleton
      class="h-50"
      v-for="n in SKELETON_CARD_COUNT"
      :key="n"
    />
  </div>

  <div
    v-else
    class="row-auto grid grid-cols-2 gap-8 px-10"
    id="characterInfoList"
  >
    <div v-if="isCharInfoRefetching">
      <CharacterCardSkeleton class="h-50" />
    </div>

    <CharCardRoot
      v-for="char in characters"
      :key="char.id"
      v-bind="char"
      class="col-span-1 row-span-1 h-50"
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
