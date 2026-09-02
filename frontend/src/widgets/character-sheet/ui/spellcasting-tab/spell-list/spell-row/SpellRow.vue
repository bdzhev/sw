<script setup lang="ts">
import { Trash2, WandSparkles } from 'lucide-vue-next';
import { computed } from 'vue';

import type { CharacterSpell } from '@shared/api/characters';
import { Button } from '@shared/ui/button';

import { canCast } from '@widgets/character-sheet/lib/spellcasting';
import { useSpellMeta } from '@widgets/character-sheet/model/spellcasting';

import type { SpellRowProps } from './SpellRow.types';

const props = withDefaults(defineProps<SpellRowProps>(), { isSaving: false });

/** The row carries which spell was acted on, so nothing above has to work it out. */
const emit = defineEmits<{
  open: [spell: CharacterSpell];
  cast: [spell: CharacterSpell];
  remove: [spell: CharacterSpell];
}>();

const { name, level, metaLine, isCastable } = useSpellMeta(() => {
  return props.spell;
});

/** Nothing at or above its level left. The button stays visible so the reason is legible. */
const hasNoSlots = computed(() => {
  return level.value === null || !canCast(level.value, props.slots);
});

const handleCastClick = (): void => {
  emit('cast', props.spell);
};

const handleOpenClick = (): void => {
  emit('open', props.spell);
};

const handleRemoveClick = (): void => {
  emit('remove', props.spell);
};
</script>

<template>
  <li
    class="flex items-center justify-between gap-3 rounded-md border border-border bg-bg-secondary"
  >
    <Button
      variant="transparent"
      align="start"
      width="full"
      :is-unpadded="true"
      class="min-w-0 p-3"
      @click="handleOpenClick"
    >
      <span class="flex min-w-0 flex-col gap-1 text-left">
        <span class="truncate text-sm font-medium text-primary">{{ name }}</span>

        <span v-if="metaLine" class="truncate text-xs text-secondary">
          {{ metaLine }}
        </span>
      </span>
    </Button>

    <div class="mr-2 flex shrink-0 items-center gap-1">
      <!-- Icon-only, so the label the button already carried is now its whole name. -->
      <Button
        v-if="isCastable"
        size="sm"
        variant="secondary"
        :is-icon-only="true"
        :is-disabled="hasNoSlots || props.isSaving"
        :aria-label="hasNoSlots ? `No slots left for ${name}` : `Cast ${name}`"
        @click="handleCastClick"
      >
        <WandSparkles :size="16" />
      </Button>

      <Button
        variant="ghostDanger"
        size="sm"
        :is-icon-only="true"
        :is-disabled="props.isSaving"
        aria-label="Remove spell"
        @click="handleRemoveClick"
      >
        <Trash2 :size="16" />
      </Button>
    </div>
  </li>
</template>
