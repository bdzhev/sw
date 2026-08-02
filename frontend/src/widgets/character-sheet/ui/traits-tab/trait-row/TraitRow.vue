<script setup lang="ts">
import { Info, Pencil, Pin, PinOff, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';

import { Button } from '@shared/ui/button';

import { TRAIT_TAG_LABELS } from '@widgets/character-sheet/config/traits';

import type { TraitRowProps } from './TraitRow.types';

const props = withDefaults(defineProps<TraitRowProps>(), { isSaving: false });

const emit = defineEmits<{
  info: [];
  edit: [];
  remove: [];
  togglePin: [];
}>();

const tagLabel = computed(() => {
  return TRAIT_TAG_LABELS[props.trait.tag];
});
</script>

<template>
  <li
    class="flex flex-col gap-1 rounded-md border border-border bg-bg-secondary p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
  >
    <div class="flex min-w-0 flex-col gap-1">
      <div class="flex min-w-0 items-center gap-2">
        <span class="truncate text-sm font-medium text-primary">
          {{ props.trait.name }}
        </span>

        <Pin
          v-if="props.trait.quickReference"
          :size="14"
          class="shrink-0 text-accent-primary"
          aria-label="Pinned to quick reference"
        />
      </div>

      <span
        class="w-fit rounded-full border border-border px-2 py-0.5 text-xs text-secondary"
      >
        {{ tagLabel }}
      </span>
    </div>

    <div class="flex shrink-0 items-center justify-end gap-1">
      <Button
        variant="neutral"
        is-icon-only
        aria-label="View description"
        @click="emit('info')"
      >
        <Info :size="18" />
      </Button>

      <Button
        variant="neutral"
        is-icon-only
        :aria-pressed="props.trait.quickReference"
        :aria-label="
          props.trait.quickReference
            ? 'Unpin from quick reference'
            : 'Pin to quick reference'
        "
        :disabled="props.isSaving"
        @click="emit('togglePin')"
      >
        <Pin v-if="!props.trait.quickReference" :size="18" />

        <PinOff v-else :size="18" />
      </Button>

      <Button
        variant="neutral"
        is-icon-only
        aria-label="Edit trait"
        @click="emit('edit')"
      >
        <Pencil :size="18" />
      </Button>

      <Button
        variant="neutral"
        is-icon-only
        aria-label="Delete trait"
        @click="emit('remove')"
      >
        <Trash2 :size="18" />
      </Button>
    </div>
  </li>
</template>
