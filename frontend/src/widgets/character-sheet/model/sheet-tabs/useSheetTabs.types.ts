import type { RouteLocationRaw } from 'vue-router';

/**
 * Five tabs. Favourites is deliberately not one of them — its items group moved
 * into the quick-access overlay, which renders over or beside the current tab
 * rather than replacing it, because a tab switch is the cost it exists to avoid.
 */
export enum SheetTab {
  MAIN = 'main',
  SKILLS = 'skills',
  COMBAT = 'combat',
  SPELLCASTING = 'spellcasting',
  TRAITS = 'traits',
}

export interface SheetTabDefinition {
  id: SheetTab;
  label: string;
}

/** A definition bound to the character being viewed, so the tab is a real link. */
export interface SheetTabLink extends SheetTabDefinition {
  to: RouteLocationRaw;
}
