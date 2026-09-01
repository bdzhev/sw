<script setup lang="ts">
import { computed } from 'vue';

import { RouteName } from '@shared/lib/router';

import { useSheetAutosave } from '@entities/characters';

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

const { characterId, character, isFetchingCharacter, handlePatch } = useSheetShell();

const { activeTab, tabs } = useSheetTabs(characterId);
const autosave = useSheetAutosave();

const TAB_COMPONENTS = {
  [SheetTab.MAIN]: MainTab,
  [SheetTab.SKILLS]: SkillsTab,
  [SheetTab.COMBAT]: CombatTab,
  [SheetTab.SPELLCASTING]: SpellcastingTab,
  [SheetTab.TRAITS]: TraitsTab,
};

/** Items and settings are pages of their own, so these are links out, not tabs. */
const itemsLink = computed(() => {
  return { name: RouteName.APP_CHARACTER_ITEMS, params: { id: characterId } };
});

const settingsLink = computed(() => {
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

    <StatusBar
      :save-state="autosave.saveState"
      :has-unsaved-changes="autosave.hasUnsavedChanges"
    />
  </div>
</template>
