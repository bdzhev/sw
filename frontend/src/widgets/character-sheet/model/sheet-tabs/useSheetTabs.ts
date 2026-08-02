import { computed, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

import { RouteName } from '@shared/lib/router';

import {
  SheetTab,
  type SheetTabDefinition,
  type SheetTabLink,
} from './useSheetTabs.types';

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

interface UseSheetTabs {
  activeTab: ComputedRef<SheetTab>;
  tabs: ComputedRef<SheetTabLink[]>;
}

/**
 * Tab state lives in the route, not in a ref: the sheet has to survive the
 * mid-combat refresh the save strategy is built around, the back button has to
 * work, and a tab has to be linkable. An unknown or missing `:tab` falls back
 * to main rather than rendering nothing.
 *
 * Each tab carries its own target, so the nav is `RouterLink`s rather than
 * buttons that ask the router to do what a link already does.
 */
export const useSheetTabs = (characterId: string): UseSheetTabs => {
  const route = useRoute();

  const activeTab = computed<SheetTab>(() => {
    const raw = route.params.tab;
    const value = Array.isArray(raw) ? raw[0] : raw;

    return value && isSheetTab(value) ? value : SheetTab.MAIN;
  });

  const tabs = computed<SheetTabLink[]>(() => {
    return SHEET_TABS.map((tab) => {
      return {
        ...tab,
        to: {
          name: RouteName.APP_CHARACTER,
          params: { id: characterId, tab: tab.id },
        },
      };
    });
  });

  return { activeTab, tabs };
};
