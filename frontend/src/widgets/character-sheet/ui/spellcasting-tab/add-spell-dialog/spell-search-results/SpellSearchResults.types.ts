import type { SpellReference } from '@shared/api/spells';

export interface SpellSearchResultsProps {
  spells: SpellReference[];
  /** False until the button is pressed — the box holds its height either way. */
  hasSearched: boolean;
  addedSpellIds: Set<string>;
  isLoading: boolean;
  hasNoResults: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  /**
   * Offer the whole library instead of a bare "no results". A class search that
   * finds nothing is the normal case for a subclass caster, not a dead end.
   */
  canWidenSearch: boolean;
  isSaving?: boolean;
}
