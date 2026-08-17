<script setup lang="ts">
import { computed } from 'vue';

import { Text } from '@shared/ui/text';

import { barClasses, dotClasses, labelThemes } from './StatusBar.themes';
import type { StatusBarProps, StatusKey } from './StatusBar.types';

const props = withDefaults(defineProps<StatusBarProps>(), {
  hasUnsavedChanges: false,
});

const STATUS_LABELS: Record<StatusKey, string> = {
  idle: 'All changes saved',
  pending: 'Unsaved changes…',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Could not save — retrying',
};

/**
 * `saved` returns to `idle` on its own — the autosave store holds the badge
 * timer, so the green is timed where the save is, not here.
 */
const status = computed<StatusKey>(() => {
  if (props.saveState === 'idle' && props.hasUnsavedChanges) return 'pending';

  return props.saveState;
});
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    :class="[
      'sticky bottom-0 z-40 page-x-bleed flex h-8 shrink-0 items-center gap-2 border-t bg-bg-secondary/80 backdrop-blur-md transition-all duration-300',
      barClasses[status],
    ]"
  >
    <span
      aria-hidden="true"
      :class="[
        'size-2 shrink-0 rounded-full bg-current transition-all',
        dotClasses[status],
      ]"
    />

    <Text size="xxs" :theme="labelThemes[status]" class="truncate transition-colors">
      {{ STATUS_LABELS[status] }}
    </Text>
  </div>
</template>
