<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

import { CharacterStatus, type SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { useBreakpoint } from '@shared/lib/ui';
import { Skeleton } from '@shared/ui/skeleton';
import { Text } from '@shared/ui/text';

import { useCharacter, useSheetAutosave } from '@entities/characters';

import { MobileNavHeader } from '@widgets/sidebar-navigation';

import { SheetTab, useSheetTabs } from '../model/useSheetTabs';
import { CombatTab } from './combat-tab';
import { MainTab } from './main-tab';
import { SheetHeader } from './sheet-header';
import { SheetTabs } from './sheet-tabs';
import { SkillsTab } from './skills-tab';
import { SpellcastingTab } from './spellcasting-tab';
import { TraitsTab } from './traits-tab';

const { isMobile } = useBreakpoint();

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const { character, isFetchingCharacter, isCharacterNotFound } = useCharacter({
  id,
});
const { activeTab, selectTab, tabs } = useSheetTabs(id);
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

const onPatch = (patch: SheetPatch, immediate = false) => {
  autosave.patchSheet(patch, immediate);
};

const onHidden = () => {
  // visibilitychange is the only teardown signal iOS reliably fires, and this
  // app is explicitly for phones at a table.
  if (document.visibilityState === 'hidden') autosave.flushOnTeardown();
};

onMounted(() => {
  document.addEventListener('visibilitychange', onHidden);
  window.addEventListener('pagehide', autosave.flushOnTeardown);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onHidden);
  window.removeEventListener('pagehide', autosave.flushOnTeardown);
  autosave.stopBadgeTimer();
});

onBeforeRouteLeave(() => {
  autosave.detach();
});
</script>

<template>
  <MobileNavHeader v-if="isMobile" />

  <div class="flex flex-col gap-4 pb-10">
    <template v-if="isFetchingCharacter && !character">
      <Skeleton class="h-48 w-full rounded-lg" />
      <Skeleton class="h-10 w-full" />
    </template>

    <template v-else-if="character">
      <SheetHeader
        :character="character.character"
        :sheet="character.sheet"
        @patch="onPatch"
      />

      <SheetTabs :tabs="tabs" :active-tab="activeTab" @select="selectTab" />

      <component :is="TAB_COMPONENTS[activeTab]" />

      <Text v-if="autosave.saveState === 'error'" size="sm" theme="danger" role="status">
        Changes could not be saved — retrying.
      </Text>

      <Text
        v-else-if="autosave.saveState !== 'idle'"
        size="sm"
        theme="secondary"
        role="status"
      >
        {{ autosave.saveState === 'saving' ? 'Saving…' : 'Saved' }}
      </Text>
    </template>
  </div>
</template>
