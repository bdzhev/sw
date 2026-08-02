import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { RouteName } from '@shared/lib/router';

import { SheetTab, type SheetTabDefinition } from './useSheetTabs.types';

export const SHEET_TABS: readonly SheetTabDefinition[] = [
  { id: SheetTab.MAIN, label: 'Main' },
  { id: SheetTab.SKILLS, label: 'Skills' },
  { id: SheetTab.COMBAT, label: 'Combat' },
  { id: SheetTab.SPELLCASTING, label: 'Spells' },
  { id: SheetTab.TRAITS, label: 'Traits' },
];

const isSheetTab = (value: string): value is SheetTab => {
  return SHEET_TABS.some((tab) => {
    return tab.id === value;
  });
};

/**
 * Tab state lives in the route, not in a ref: the sheet has to survive the
 * mid-combat refresh the save strategy is built around, the back button has to
 * work, and a tab has to be linkable. An unknown or missing `:tab` falls back
 * to main rather than rendering nothing.
 */
export const useSheetTabs = (characterId: string) => {
  const route = useRoute();
  const router = useRouter();

  const activeTab = computed<SheetTab>(() => {
    const raw = route.params.tab;
    const value = Array.isArray(raw) ? raw[0] : raw;

    return value && isSheetTab(value) ? value : SheetTab.MAIN;
  });

  const selectTab = (tab: SheetTab) => {
    if (tab === activeTab.value) return;

    void router.replace({
      name: RouteName.APP_CHARACTER,
      params: { id: characterId, tab },
    });
  };

  return { activeTab, selectTab, tabs: SHEET_TABS };
};
