<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import type { SpellReference, SpellSearchFilters } from '@shared/api/spells';
import { Button } from '@shared/ui/button';
import {
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';

import { useSpellSearch } from '@entities/spells';

import { AddSpellMode } from '@widgets/character-sheet/config/spellcasting';
import {
  useSpellForm,
  type SpellSubmitValues,
} from '@widgets/character-sheet/model/spellcasting';

import type { AddSpellDialogProps } from './AddSpellDialog.types';
import { FreeformFields } from './freeform-fields';
import { ModeSwitch } from './mode-switch';
import { SpellSearchResults } from './spell-search-results';

const props = withDefaults(defineProps<AddSpellDialogProps>(), { isSaving: false });

const emit = defineEmits<{
  'update:open': [open: boolean];
  addReference: [spell: SpellReference];
  addCustom: [values: SpellSubmitValues];
}>();

/** Three paths of equal weight — the class list, the whole library, your own words. */
const MODE_OPTIONS = [
  { value: AddSpellMode.STANDARD, label: 'My class' },
  { value: AddSpellMode.LIBRARY, label: 'Library' },
  { value: AddSpellMode.CUSTOM, label: 'Write one' },
];

const mode = ref<string>(AddSpellMode.STANDARD);
const query = ref('');

/** null until the button is pressed: the search is submitted, never typed into. */
const filters = ref<SpellSearchFilters | null>(null);

const {
  spells,
  hasNoResults,
  isLoadingSpells,
  isFetchingNextSpells,
  hasMoreSpells,
  loadNextSpells,
} = useSpellSearch(filters);

const isCustomMode = computed(() => {
  return mode.value === AddSpellMode.CUSTOM;
});

const hasSearched = computed(() => {
  return filters.value !== null;
});

/** Only the class search has somewhere wider to go. */
const canWidenSearch = computed(() => {
  return mode.value === AddSpellMode.STANDARD;
});

const { handleSubmit } = useSpellForm({
  isOpen: () => {
    return props.open;
  },
  onSubmit: (values) => {
    emit('addCustom', values);
  },
});

const runSearch = (searchMode: string): void => {
  const trimmed = query.value.trim();

  filters.value =
    searchMode === AddSpellMode.STANDARD
      ? {
          q: trimmed || undefined,
          characterClass: props.characterClass ?? undefined,
          maxLevel: props.maxCastableLevel,
        }
      : { q: trimmed || undefined };
};

const handleSearchSubmit = (): void => {
  runSearch(mode.value);
};

/** The offer under an empty class result — same words, the whole library. */
const handleWiden = (): void => {
  mode.value = AddSpellMode.LIBRARY;
  runSearch(AddSpellMode.LIBRARY);
};

const handleAddReference = (spell: SpellReference): void => {
  emit('addReference', spell);
};

const handleLoadMore = (): void => {
  void loadNextSpells();
};

const handleOpenChange = (isOpen: boolean): void => {
  emit('update:open', isOpen);
};

/** Switching tabs drops the previous results rather than showing them under a new filter. */
watch(mode, () => {
  filters.value = null;
});

/** The dialog stays mounted between openings, so it is reset on open. */
watch(
  () => {
    return props.open;
  },
  (isOpen) => {
    if (!isOpen) {
      return;
    }

    mode.value = AddSpellMode.STANDARD;
    query.value = '';
    filters.value = null;
  },
);
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        :disable-outside-close="props.isSaving"
        :aria-describedby="undefined"
      >
        <DialogHeader>
          <DialogTitle>Add a spell</DialogTitle>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody class="flex flex-col gap-4">
          <ModeSwitch
            v-model="mode"
            :options="MODE_OPTIONS"
            legend="How to add a spell"
          />

          <template v-if="!isCustomMode">
            <form class="flex items-end gap-2" @submit.prevent="handleSearchSubmit">
              <Input
                v-model="query"
                label="Search"
                :is-label-hidden="true"
                placeholder="Spell name"
              />

              <Button
                type="submit"
                size="sm"
                :is-icon-only="true"
                aria-label="Search spells"
              >
                <Search :size="16" />
              </Button>
            </form>

            <SpellSearchResults
              :spells="spells"
              :has-searched="hasSearched"
              :added-spell-ids="props.addedSpellIds"
              :is-loading="isLoadingSpells"
              :has-no-results="hasNoResults"
              :has-more="hasMoreSpells"
              :is-fetching-more="isFetchingNextSpells"
              :can-widen-search="canWidenSearch"
              :is-saving="props.isSaving"
              @add="handleAddReference"
              @widen="handleWiden"
              @load-more="handleLoadMore"
            />
          </template>

          <FreeformFields v-else />
        </DialogBody>

        <DialogFooter>
          <div class="flex flex-row flex-wrap items-center justify-end gap-2">
            <DialogClose as-child>
              <Button variant="secondary" :is-disabled="props.isSaving">Close</Button>
            </DialogClose>

            <Button
              v-if="isCustomMode"
              :is-loading="props.isSaving"
              @click="handleSubmit"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
