<script setup lang="ts">
import { Info, Pencil, Pin, PinOff, Trash2 } from 'lucide-vue-next';
import { computed } from 'vue';

import type { ClassResource } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import { useResourceMeta, useTraitsUi } from '@widgets/character-sheet/model/traits';

import { ResourceSpendControl } from '../resource-spend-control';
import type { ResourceRowProps } from './ResourceRow.types';

const props = withDefaults(defineProps<ResourceRowProps>(), { isSaving: false });

/** Writes leave the row; dialogs are opened on the store directly. */
const emit = defineEmits<{
  togglePin: [resource: ClassResource];
  spend: [resource: ClassResource, amount: number];
}>();

const ui = useTraitsUi();

const { label, pool, resetLabel, isMaxUnknown } = useResourceMeta(() => {
  return props.resource;
});

const pinLabel = computed(() => {
  return props.resource.quickReference
    ? 'Unpin from quick reference'
    : 'Pin to quick reference';
});

const handleInfoClick = (): void => {
  ui.openResourceDetail(props.resource);
};

const handleEditClick = (): void => {
  ui.openResourceDialog(props.resource);
};

const handleRemoveClick = (): void => {
  ui.askDeleteResource(props.resource);
};

const handleTogglePinClick = (): void => {
  emit('togglePin', props.resource);
};

const handleSpend = (amount: number): void => {
  emit('spend', props.resource, amount);
};
</script>

<template>
  <li class="flex flex-col gap-2 rounded-md border border-border bg-bg-secondary p-3">
    <div class="flex min-w-0 items-center gap-2">
      <span class="truncate text-sm font-medium text-primary">{{ label }}</span>

      <Pin
        v-if="props.resource.quickReference"
        :size="14"
        class="shrink-0 text-accent-primary"
        aria-label="Pinned to quick reference"
      />
    </div>

    <div class="flex items-center justify-between gap-2">
      <div class="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-2">
        <span class="text-base font-semibold text-primary tabular-nums">{{ pool }}</span>

        <span class="truncate text-xs text-secondary">{{ resetLabel }}</span>
      </div>

      <div class="flex shrink-0 items-center justify-end gap-1">
        <Button
          variant="neutral"
          is-icon-only
          aria-label="View description"
          @click="handleInfoClick"
        >
          <Info :size="18" />
        </Button>

        <Button
          variant="neutral"
          is-icon-only
          :aria-pressed="props.resource.quickReference"
          :aria-label="pinLabel"
          :is-disabled="props.isSaving"
          @click="handleTogglePinClick"
        >
          <Pin v-if="!props.resource.quickReference" :size="18" />

          <PinOff v-else :size="18" />
        </Button>

        <Button
          variant="neutral"
          is-icon-only
          aria-label="Edit resource"
          @click="handleEditClick"
        >
          <Pencil :size="18" />
        </Button>

        <Button
          variant="neutral"
          is-icon-only
          aria-label="Delete resource"
          @click="handleRemoveClick"
        >
          <Trash2 :size="18" />
        </Button>
      </div>
    </div>

    <ResourceSpendControl
      :resource="props.resource"
      :is-saving="props.isSaving"
      @spend="handleSpend"
    />

    <div v-if="isMaxUnknown" class="flex flex-col items-start gap-1">
      <Button variant="transparent" size="xs" class="min-h-11" @click="handleEditClick">
        Max unknown — set it manually
      </Button>

      <Text size="xs" theme="secondary">
        Official per-level maxima are not in the app yet, so this pool stays untracked
        until you enter one.
      </Text>
    </div>
  </li>
</template>
