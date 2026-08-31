<script setup lang="ts">
import { computed } from 'vue';

import { RouteName } from '@shared/lib/router';
import { Skeleton } from '@shared/ui/skeleton';

import { useSheetAutosave } from '@entities/characters';

import { useSheetShell } from '@widgets/character-sheet/model/sheet-shell';
import { SheetTab, useSheetTabs } from '@widgets/character-sheet/model/sheet-tabs';

import { CombatTab } from './combat-tab';
import { MainTab } from './main-tab';
import { SheetHeader } from './sheet-header';
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

/** Items is a page of its own, so this is a link out rather than a tab. */
const itemsLink = computed(() => {
  return { name: RouteName.APP_CHARACTER_ITEMS, params: { id: characterId } };
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col gap-4 pb-6">
      <template v-if="isFetchingCharacter && !character">
        <!-- Skeleton hardcodes `h-full w-full`, so its size has to come from a wrapper. -->
        <div class="h-48 w-full">
          <Skeleton class="rounded-lg" />
        </div>

        <div class="h-10 w-full">
          <Skeleton />
        </div>
      </template>

      <template v-else-if="character">
        <SheetHeader
          :character="character.character"
          :sheet="character.sheet"
          :items-link="itemsLink"
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
