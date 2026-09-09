<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

import type { SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';

import { useSheetShell } from '@widgets/character-sheet/model/sheet-shell';
import { SheetTab, useSheetTabs } from '@widgets/character-sheet/model/sheet-tabs';

import { CombatTab } from './combat-tab';
import { MainTab } from './main-tab';
import { SheetHeader } from './sheet-header';
import { SheetSkeleton } from './sheet-skeleton';
import { SheetTabs } from './sheet-tabs';
import { SkillsTab } from './skills-tab';
import { SpellcastingTab } from './spellcasting-tab';
import { StatusBar } from './status-bar';
import { TraitsTab } from './traits-tab';

const {
  characterId,
  character,
  isFetchingCharacter,
  patchSheet,
  saveState,
  hasUnsavedChanges,
} = useSheetShell();

/** The event handler; the seam itself is a method, so the component names this. */
const handlePatch = (patch: SheetPatch, immediate = false): void => {
  patchSheet(patch, immediate);
};

const { activeTab, tabs } = useSheetTabs(characterId);

const TAB_COMPONENTS = {
  [SheetTab.MAIN]: MainTab,
  [SheetTab.SKILLS]: SkillsTab,
  [SheetTab.COMBAT]: CombatTab,
  [SheetTab.SPELLCASTING]: SpellcastingTab,
  [SheetTab.TRAITS]: TraitsTab,
};

/**
 * Items and settings are pages of their own, so these are links out, not tabs.
 * The annotation is load-bearing: in an object literal an enum member widens to
 * the whole enum, and the typed route map wants the literal.
 */
const itemsLink = computed<RouteLocationRaw>(() => {
  return { name: RouteName.APP_CHARACTER_ITEMS, params: { id: characterId } };
});

const settingsLink = computed<RouteLocationRaw>(() => {
  return { name: RouteName.APP_CHARACTER_SETTINGS, params: { id: characterId } };
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col gap-4 pb-6">
      <SheetSkeleton v-if="isFetchingCharacter && !character" />

      <template v-else-if="character">
        <SheetHeader
          :character="character.character"
          :sheet="character.sheet"
          :items-link="itemsLink"
          :settings-link="settingsLink"
          @patch="handlePatch"
        />

        <SheetTabs :tabs="tabs" :active-tab="activeTab" />

        <component :is="TAB_COMPONENTS[activeTab]" />
      </template>
    </div>

    <StatusBar :save-state="saveState" :has-unsaved-changes="hasUnsavedChanges" />
  </div>
</template>
