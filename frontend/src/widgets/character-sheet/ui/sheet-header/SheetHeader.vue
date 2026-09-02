<script setup lang="ts">
import { Settings, ToolCase } from 'lucide-vue-next';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { BackButton } from '@shared/ui/back-button';
import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import { withDeathSaveReset } from '@widgets/character-sheet/lib/header';

import { ConditionsStrip } from './conditions-strip';
import { DeathSaves } from './death-saves';
import type { SheetHeaderProps } from './SheetHeader.types';
import { StatFields } from './stat-fields';

const props = defineProps<SheetHeaderProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const subtitle = computed(() => {
  const { race, characterClass } = props.character;

  return `${race} ${characterClass} · level ${props.sheet.level}`;
});

const dashboardLink = { name: RouteName.APP_HOME };

/**
 * `hpMax` guards the band: a character is born with both at 0, and a sheet that
 * has never had a hit point is not dying.
 */
const isDying = computed(() => {
  return props.sheet.hpCurrent === 0 && props.sheet.hpMax > 0;
});

/**
 * Every header edit goes through here, which is what lets the hp field stay
 * presentational — `StatFields` does not know death saves exist.
 */
const handlePatch = (patch: SheetPatch, immediate = false): void => {
  emit('patch', withDeathSaveReset(patch, props.sheet), immediate);
};
</script>

<template>
  <header
    class="page-x-bleed flex flex-col gap-4 border-b border-border bg-bg-secondary py-4 md:py-6"
  >
    <!--
      One wrapping flex row, not two nested groups. That is what lets the two
      link buttons be rendered *once* and still land in both places they have to:
      at the right end of the name row on a phone, and immediately left of the
      stat fields from md up. `flex-1` on the name group is what pushes everything
      after it to the right, and StatFields already carries `w-full` below md,
      which is what forces it onto a line of its own here.
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

      <div class="flex shrink-0 items-center gap-1">
        <Button
          :as="RouterLink"
          :to="props.itemsLink"
          variant="accent"
          is-icon-only
          aria-label="Items and currency"
        >
          <ToolCase :size="20" />
        </Button>

        <Button
          :as="RouterLink"
          :to="props.settingsLink"
          variant="neutral"
          is-icon-only
          aria-label="Character details and settings"
        >
          <Settings :size="20" />
        </Button>
      </div>

      <StatFields :sheet="props.sheet" @patch="handlePatch" />
    </div>

    <DeathSaves
      v-if="isDying"
      :successes="props.sheet.deathSaveSuccesses"
      :failures="props.sheet.deathSaveFailures"
      @patch="handlePatch"
    />

    <ConditionsStrip :conditions="props.sheet.conditions" @patch="handlePatch" />
  </header>
</template>
