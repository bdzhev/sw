<script setup lang="ts">
import { ToolCase } from 'lucide-vue-next';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import { BackButton } from '../back-button';
import type { SheetHeaderProps } from './SheetHeader.types';
import { StatFields } from './stat-fields';

const props = defineProps<SheetHeaderProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const subtitle = computed(() => {
  const { race, characterClass } = props.character;

  return `${race} ${characterClass} · level ${props.sheet.level}`;
});

const dashboardLink = { name: RouteName.APP_HOME };

const handlePatch = (patch: SheetPatch, immediate = false): void => {
  emit('patch', patch, immediate);
};
</script>

<template>
  <header
    class="page-x-bleed flex flex-col gap-4 border-b border-border bg-bg-secondary py-4 md:py-6"
  >
    <!--
      One wrapping flex row, not two nested groups. That is what lets the
      equipment button be rendered *once* and still land in both places it has to:
      at the right end of the name row on a phone, and immediately left of the
      stat fields from md up. `flex-1` on the name group is what pushes everything
      after it to the right, and StatFields already carries `w-full` below md,
      which is what forces it onto a line of its own here.

      `items-center` throughout so the back button, the name/class block, the
      equipment button and the stat fields all sit on one centre line.
    -->
    <div class="flex flex-wrap items-center gap-x-2 gap-y-4 md:flex-nowrap md:gap-x-4">
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <BackButton :to="dashboardLink" label="Back to your characters" class="-ml-1" />

        <div class="flex min-w-0 flex-col gap-1">
          <h1 class="truncate text-2xl font-semibold text-primary">
            {{ props.character.name }}
          </h1>

          <Text size="sm" theme="secondary" class="capitalize">{{ subtitle }}</Text>
        </div>
      </div>

      <!--
        `accent` rather than `neutral`: this is the only way to the inventory, so
        it should not read as dim chrome. Default `sm` size, not the back button's
        `xs` — a navigation target you aim for keeps its 44px box.

        lucide ships no chest; its toolbox is `tool-case`, exported as ToolCase.
      -->
      <Button
        :as="RouterLink"
        :to="props.itemsLink"
        variant="accent"
        is-icon-only
        class="shrink-0"
        aria-label="Items and currency"
      >
        <ToolCase :size="20" />
      </Button>

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
