<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import type { SheetHeaderProps } from './SheetHeader.types';
import { StatFields } from './stat-fields';

const props = defineProps<SheetHeaderProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/** Level reads as identity, not as a stat to track — so it lives in the subtitle. */
const subtitle = computed(() => {
  const { race, characterClass } = props.character;

  return `${race} ${characterClass} · level ${props.sheet.level}`;
});

/**
 * The sheet has no sidebar at any width, so this is the only way out. `:as` gives
 * one <a> with button styling rather than the legacy link-wrapping-a-button
 * shape, which nests interactive elements.
 */
const dashboardLink = { name: RouteName.APP_HOME };

const handlePatch = (patch: SheetPatch, immediate = false): void => {
  emit('patch', patch, immediate);
};
</script>

<template>
  <header
    class="page-x-bleed flex flex-col gap-4 border-b border-border bg-bg-secondary py-4 md:py-6"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex min-w-0 items-start gap-1">
        <!-- `xs` is the icon-only size that hugs its glyph — see iconOnlyClasses. -->
        <Button
          :as="RouterLink"
          :to="dashboardLink"
          variant="neutral"
          size="xs"
          is-icon-only
          class="mt-1 mr-1 -ml-1 shrink-0"
          aria-label="Back to your characters"
        >
          <ChevronLeft :size="18" />
        </Button>

        <div class="flex min-w-0 flex-col gap-1">
          <h1 class="truncate text-2xl font-semibold text-primary">
            {{ props.character.name }}
          </h1>

          <Text size="sm" theme="secondary" class="capitalize">{{ subtitle }}</Text>
        </div>
      </div>

      <StatFields :sheet="props.sheet" @patch="handlePatch" />
    </div>

    <div v-if="props.sheet.conditions.length" class="flex flex-wrap items-center gap-2">
      <span
        v-for="condition in props.sheet.conditions"
        :key="condition"
        class="rounded-full bg-warning/20 px-3 py-1 text-xs text-warning"
      >
        {{ condition }}
      </span>
    </div>
  </header>
</template>
