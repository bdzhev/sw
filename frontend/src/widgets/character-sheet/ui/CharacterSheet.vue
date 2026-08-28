<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

import { CharacterStatus, type SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { useBreakpoint } from '@shared/lib/ui';
import { Skeleton } from '@shared/ui/skeleton';

import { useCharacter, useSheetAutosave } from '@entities/characters';

import { SheetTab, useSheetTabs } from '@widgets/character-sheet/model/sheet-tabs';
import { MobileNavHeader } from '@widgets/sidebar-navigation';

import { CombatTab } from './combat-tab';
import { MainTab } from './main-tab';
import { SheetHeader } from './sheet-header';
import { SheetTabs } from './sheet-tabs';
import { SkillsTab } from './skills-tab';
import { SpellcastingTab } from './spellcasting-tab';
import { StatusBar } from './status-bar';
import { TraitsTab } from './traits-tab';

const { isMobile } = useBreakpoint();

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const { character, isFetchingCharacter, isCharacterNotFound } = useCharacter({
  id,
});
const { activeTab, tabs } = useSheetTabs(id);
const autosave = useSheetAutosave();

const TAB_COMPONENTS = {
  [SheetTab.MAIN]: MainTab,
  [SheetTab.SKILLS]: SkillsTab,
  [SheetTab.COMBAT]: CombatTab,
  [SheetTab.SPELLCASTING]: SpellcastingTab,
  [SheetTab.TRAITS]: TraitsTab,
};

watch(
  character,
  (detail) => {
    if (!detail) return;

    // The quiz is the only path to a character with scores, so a pending one
    // goes back to it rather than being shown an all-tens sheet.
    if (detail.character.status === CharacterStatus.PENDING) {
      void router.replace({ name: RouteName.APP_BUILDER, params: { id } });

      return;
    }

    autosave.attach(id, detail.sheet);
  },
  { immediate: true },
);

watch(isCharacterNotFound, (notFound) => {
  if (notFound) {
    void router.replace({ name: RouteName.NOT_FOUND });
  }
});

const handlePatch = (patch: SheetPatch, immediate = false): void => {
  autosave.patchSheet(patch, immediate);
};

const handleVisibilityChange = (): void => {
  // visibilitychange is the only teardown signal iOS reliably fires, and this
  // app is explicitly for phones at a table.
  if (document.visibilityState === 'hidden') {
    autosave.flushOnTeardown();
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', autosave.flushOnTeardown);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('pagehide', autosave.flushOnTeardown);
  autosave.stopBadgeTimer();
});

onBeforeRouteLeave(() => {
  autosave.detach();
});
</script>

<template>
  <MobileNavHeader v-if="isMobile" class="page-x-escape" />

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
