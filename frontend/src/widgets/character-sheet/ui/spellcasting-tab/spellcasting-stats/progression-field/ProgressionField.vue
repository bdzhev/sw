<script setup lang="ts">
import { computed } from 'vue';

import { SpellcastingProgression } from '@shared/api/characters';
import type { SheetPatch } from '@shared/api/characters';
import { Select } from '@shared/ui/select';
import type { SelectOption } from '@shared/ui/select';
import { Text } from '@shared/ui/text';

import { PROGRESSION_OPTIONS } from '@widgets/character-sheet/config/spellcasting';

import type { ProgressionFieldProps } from './ProgressionField.types';

const props = defineProps<ProgressionFieldProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/**
 * The presentational half of `select`: the sheet has no form, so there is no
 * `name` to bind and nothing to validate on submit.
 */
const value = computed<SelectOption['value'] | undefined>({
  get: () => {
    return props.progression;
  },
  set: (next) => {
    if (!next) {
      return;
    }

    // A one-shot edit with no follow-up write to carry it, so it goes
    // immediately rather than waiting out the debounce — same as Inspiration.
    emit('patch', { spellcastingProgression: next as SpellcastingProgression }, true);
  },
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <Select
      v-model="value"
      label="Progression"
      :options="PROGRESSION_OPTIONS"
      class="max-w-field"
    />

    <Text size="xs" theme="secondary">
      Sets your spellcasting ability for save DC and attack bonus — an eldritch knight or
      arcane trickster casts off Intelligence. Slots are yours to set below.
    </Text>
  </div>
</template>
