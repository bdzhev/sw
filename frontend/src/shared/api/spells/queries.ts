import type { SpellSearchFilters } from './types';

const BASE_QUERY_PART = 'spells';

/**
 * The only query key in the app not scoped to a character — the reference
 * library is the same rows for everyone.
 */
export const spellQueries = {
  search: (filters: SpellSearchFilters) => {
    return [BASE_QUERY_PART, 'search', filters];
  },
};
