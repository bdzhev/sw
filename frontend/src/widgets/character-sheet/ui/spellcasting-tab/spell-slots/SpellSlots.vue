<script setup lang="ts">
import { computed, ref } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Accordion, AccordionItem } from '@shared/ui/accordion';
import { Button } from '@shared/ui/button';

import { MAX_SLOT_LEVEL } from '@widgets/character-sheet/config/spellcasting';
import { slotPools } from '@widgets/character-sheet/lib/spellcasting';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { SlotRow } from './slot-row';
import { SlotSummary } from './slot-summary';
import type { SpellSlotsProps } from './SpellSlots.types';

const ITEM_VALUE = 'spell-slots';

const props = defineProps<SpellSlotsProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/** Collapsed by default: the summary is what you want mid-combat, not nine editors. */
const expanded = ref<string | string[] | undefined>(undefined);

/**
 * Only the levels with a pool, and shared with the cast picker so the two
 * cannot disagree about which levels exist.
 */
const pools = computed(() => {
  return slotPools(props.slots);
});

/**
 * All nine when open, for everyone — typing a max into level 3 is how level 3
 * comes to exist. The class tables no longer decide what a character can have.
 */
const slotLevels = computed(() => {
  return Array.from({ length: MAX_SLOT_LEVEL }, (_, index) => {
    return index + 1;
  });
});

/**
 * Pact magic lands in the same keyspace as everything else, so it needs no
 * branch — but nothing else in the app records that it comes back on a short
 * rest, and the rest flow depends on that fact.
 */
const title = computed(() => {
  return props.isPactMagic ? 'Pact magic' : 'Spell slots';
});

const description = computed(() => {
  return props.isPactMagic
    ? 'Yours to set. Pact slots are all one level, and they come back on a short rest.'
    : 'Yours to set — check the rules for your class and level.';
});

const currentFor = (slotLevel: number): number => {
  return props.slots.current[String(slotLevel)] ?? 0;
};

const maxFor = (slotLevel: number): number => {
  return props.slots.max?.[String(slotLevel)] ?? 0;
};

/**
 * The whole `spellSlots` object every time. The autosave buffer merges pending
 * patches shallowly by sheet field — last write wins, no deep merge — so
 * sending half of it would drop the other half if an edit were still queued.
 */
const handleCurrentChange = (slotLevel: number, value: number): void => {
  emit('patch', {
    spellSlots: {
      ...props.slots,
      current: { ...props.slots.current, [String(slotLevel)]: value },
    },
  });
};

const handleMaxChange = (slotLevel: number, value: number): void => {
  emit('patch', {
    spellSlots: {
      ...props.slots,
      max: { ...props.slots.max, [String(slotLevel)]: value },
    },
  });
};

/** Offered, never imposed — the tables are a shortcut, not the source of truth. */
const handleFillClick = (): void => {
  if (!props.tableMaxima) return;

  emit('patch', { spellSlots: { ...props.slots, max: props.tableMaxima } });
};
</script>

<template>
  <SheetSection :title="title" :description="description">
    <template v-if="props.tableMaxima" #actions>
      <Button size="xs" variant="secondary" class="min-h-11" @click="handleFillClick">
        Fill from class table
      </Button>
    </template>

    <!--
      The summary stays put when the panel opens rather than being swapped out:
      it is the trigger's only content, so hiding it would leave a bare chevron
      with nothing to announce — and the pips are worth watching while you edit.
    -->
    <Accordion v-model="expanded">
      <AccordionItem :value="ITEM_VALUE" variant="plain">
        <template #trigger>
          <SlotSummary :pools="pools" />
        </template>

        <ul class="flex flex-col gap-2">
          <SlotRow
            v-for="slotLevel in slotLevels"
            :key="slotLevel"
            :slot-level="slotLevel"
            :current="currentFor(slotLevel)"
            :max="maxFor(slotLevel)"
            @change-current="handleCurrentChange"
            @change-max="handleMaxChange"
          />
        </ul>
      </AccordionItem>
    </Accordion>
  </SheetSection>
</template>
