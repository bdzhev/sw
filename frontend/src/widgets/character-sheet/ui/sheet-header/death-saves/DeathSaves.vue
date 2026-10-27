<script setup lang="ts">
import { Skull } from 'lucide-vue-next';
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { DEATH_SAVE_SLOTS } from '@widgets/character-sheet/config/header';

import type { DeathSavesProps } from './DeathSaves.types';
import { PipRow } from './pip-row';

const props = defineProps<DeathSavesProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/** Failures first: three of them ends the character, three successes only stabilises. */
const outcome = computed(() => {
  if (props.failures >= DEATH_SAVE_SLOTS) {
    return 'Three failures — the character is dead.';
  }

  if (props.successes >= DEATH_SAVE_SLOTS) {
    return 'Three successes — stable, and no longer dying.';
  }

  return null;
});

/** Single-shot edits, like inspiration — nothing follows to carry them. */
const handleSuccessesChange = (count: number): void => {
  emit('patch', { deathSaveSuccesses: count }, true);
};

const handleFailuresChange = (count: number): void => {
  emit('patch', { deathSaveFailures: count }, true);
};
</script>

<template>
  <div class="flex flex-col gap-1 rounded-md border border-danger/40 bg-danger/10 p-3">
    <div class="align-center flex flex-row text-danger">
      <h2 class="text-xs font-semibold uppercase">Death saves</h2>

      <Skull :size="12" class="relative top-px ml-0.5" />
    </div>

    <div class="flex flex-wrap items-start gap-x-6 gap-y-2">
      <PipRow
        legend="successes"
        pip-label="Success"
        :count="props.successes"
        :total="DEATH_SAVE_SLOTS"
        @change="handleSuccessesChange"
      />

      <PipRow
        legend="failures"
        pip-label="Failure"
        :count="props.failures"
        :total="DEATH_SAVE_SLOTS"
        @change="handleFailuresChange"
      />
    </div>

    <Text v-if="outcome" size="xs" theme="danger">{{ outcome }}</Text>
  </div>
</template>
