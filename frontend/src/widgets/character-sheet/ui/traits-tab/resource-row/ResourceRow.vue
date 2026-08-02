<script setup lang="ts">
import { Info, Pencil, Pin, PinOff, Trash2 } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import { useResourceMeta } from '@widgets/character-sheet/model/traits/useResourceMeta';

import { ResourceSpendControl } from '../resource-spend-control';
import type { ResourceRowProps } from './ResourceRow.types';

const props = withDefaults(defineProps<ResourceRowProps>(), { isSaving: false });

const emit = defineEmits<{
  info: [];
  edit: [];
  remove: [];
  togglePin: [];
  spend: [amount: number];
}>();

const { label, pool, resetLabel, isMaxUnknown } = useResourceMeta(() => {
  return props.resource;
});
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
          @click="emit('info')"
        >
          <Info :size="18" />
        </Button>

        <Button
          variant="neutral"
          is-icon-only
          :aria-pressed="props.resource.quickReference"
          :aria-label="
            props.resource.quickReference
              ? 'Unpin from quick reference'
              : 'Pin to quick reference'
          "
          :disabled="props.isSaving"
          @click="emit('togglePin')"
        >
          <Pin v-if="!props.resource.quickReference" :size="18" />

          <PinOff v-else :size="18" />
        </Button>

        <Button
          variant="neutral"
          is-icon-only
          aria-label="Edit resource"
          @click="emit('edit')"
        >
          <Pencil :size="18" />
        </Button>

        <Button
          variant="neutral"
          is-icon-only
          aria-label="Delete resource"
          @click="emit('remove')"
        >
          <Trash2 :size="18" />
        </Button>
      </div>
    </div>

    <ResourceSpendControl
      :resource="props.resource"
      :is-saving="props.isSaving"
      @spend="
        (amount) => {
          return emit('spend', amount);
        }
      "
    />

    <div v-if="isMaxUnknown" class="flex flex-col items-start gap-1">
      <Button variant="transparent" size="xs" class="min-h-11" @click="emit('edit')">
        Max unknown — set it manually
      </Button>

      <Text size="xs" theme="secondary">
        Official per-level maxima are not in the app yet, so this pool stays untracked
        until you enter one.
      </Text>
    </div>
  </li>
</template>
