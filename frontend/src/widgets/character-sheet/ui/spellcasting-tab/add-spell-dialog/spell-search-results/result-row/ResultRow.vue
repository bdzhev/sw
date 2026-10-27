<script setup lang="ts">
import { Check, Plus } from 'lucide-vue-next';
import { computed } from 'vue';

import type { SpellReference } from '@shared/api/spells';
import { AccordionItem } from '@shared/ui/accordion';
import { Button } from '@shared/ui/button';

import {
  spellComponentsLabel,
  spellLevelLabel,
  spellMetaLine,
} from '@widgets/character-sheet/lib/spellcasting';

import { SpellDetails } from '../../../spell-details';
import type { ResultRowProps } from './ResultRow.types';

const props = withDefaults(defineProps<ResultRowProps>(), { isSaving: false });

const emit = defineEmits<{ add: [spell: SpellReference] }>();

const metaLine = computed(() => {
  return spellMetaLine([
    spellLevelLabel(props.spell.level),
    props.spell.school,
    props.spell.concentration && 'Concentration',
    props.spell.ritual && 'Ritual',
  ]);
});

const components = computed(() => {
  return spellComponentsLabel(props.spell.components);
});

const handleAddClick = (): void => {
  emit('add', props.spell);
};
</script>

<template>
  <!-- Tap the row to read it before committing; Add sits outside the trigger. -->
  <AccordionItem :value="props.spell.id">
    <template #trigger>
      <span class="flex min-w-0 flex-col gap-1">
        <span class="truncate text-sm font-medium text-primary">
          {{ props.spell.name }}
        </span>

        <span class="truncate text-xs text-secondary">{{ metaLine }}</span>
      </span>
    </template>

    <template #actions>
      <Button
        size="xs"
        variant="secondary"
        :is-icon-only="true"
        :is-disabled="props.isAdded || props.isSaving"
        :aria-label="props.isAdded ? 'Already on your list' : `Add ${props.spell.name}`"
        class="shrink-0"
        @click="handleAddClick"
      >
        <Check v-if="props.isAdded" :size="16" />

        <Plus v-else :size="16" />
      </Button>
    </template>

    <SpellDetails
      :casting-time="props.spell.castingTime"
      :range-text="props.spell.rangeText"
      :components="components"
      :duration="props.spell.duration"
      :description="props.spell.description"
      :higher-level="props.spell.higherLevel"
    />
  </AccordionItem>
</template>
