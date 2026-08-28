<script setup lang="ts">
import { ref } from 'vue';

import type { SpellReference } from '@shared/api/spells';
import { Accordion } from '@shared/ui/accordion';
import { Button } from '@shared/ui/button';
import { ScrollArea } from '@shared/ui/scroll-area';
import { Skeleton } from '@shared/ui/skeleton';
import { Text } from '@shared/ui/text';

import { ResultRow } from './result-row';
import type { SpellSearchResultsProps } from './SpellSearchResults.types';

const props = withDefaults(defineProps<SpellSearchResultsProps>(), { isSaving: false });

const emit = defineEmits<{
  add: [spell: SpellReference];
  widen: [];
  loadMore: [];
}>();

/** One panel open at a time — two open spell cards is not a comparison, it is a wall. */
const expanded = ref<string | string[] | undefined>(undefined);

const handleAdd = (spell: SpellReference): void => {
  emit('add', spell);
};

const handleWidenClick = (): void => {
  emit('widen');
};

const handleLoadMoreClick = (): void => {
  emit('loadMore');
};
</script>

<template>
  <!--
    Fixed height, not max-height. The dialog is centred with `-translate-1/2`, so
    anything that changes the body's height moves the whole dialog — header
    included. Loading, results, no-results and an expanded panel all have to live
    in the same box or the thing jiggles on every search.
  -->
  <div class="h-72 w-full">
    <div
      v-if="!props.hasSearched"
      class="flex h-full items-center justify-center px-6 text-center"
    >
      <Text size="sm" theme="secondary">
        Type a name and search — or search with the box empty to browse everything.
      </Text>
    </div>

    <Skeleton v-else-if="props.isLoading" class="rounded-md" />

    <div
      v-else-if="props.hasNoResults"
      class="flex h-full flex-col items-start justify-center gap-2"
    >
      <Text v-if="props.canWidenSearch" size="sm" theme="secondary">
        No class spells match — search the whole library?
      </Text>

      <Text v-else size="sm" theme="secondary">
        Nothing matches. Try fewer letters, or write it in yourself.
      </Text>

      <Button
        v-if="props.canWidenSearch"
        size="sm"
        variant="secondary"
        @click="handleWidenClick"
      >
        Search the whole library
      </Button>
    </div>

    <ScrollArea v-else :should-fade="true" class="h-full">
      <Accordion v-model="expanded" class="pr-2">
        <ResultRow
          v-for="spell in props.spells"
          :key="spell.id"
          :spell="spell"
          :is-added="props.addedSpellIds.has(spell.id)"
          :is-saving="props.isSaving"
          @add="handleAdd"
        />

        <div v-if="props.hasMore" class="flex justify-center py-2">
          <Button
            size="sm"
            variant="secondary"
            :is-loading="props.isFetchingMore"
            @click="handleLoadMoreClick"
          >
            Load more
          </Button>
        </div>
      </Accordion>
    </ScrollArea>
  </div>
</template>
