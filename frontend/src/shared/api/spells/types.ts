import type { CharacterClass, SpellReference } from '@shared/api/characters';

export type { SpellReference };

/**
 * Every filter is optional and they compose: the standard search sends
 * `characterClass` + `maxLevel`, the library search sends `q` alone.
 */
export interface SpellSearchFilters {
  q?: string;
  characterClass?: CharacterClass;
  maxLevel?: number;
}

export interface SpellSearchParams extends SpellSearchFilters {
  offset?: number;
}

export interface SpellSearchPage {
  items: SpellReference[];
  total: number;
}
