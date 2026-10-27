import { http } from '@shared/lib/http';

import type { SpellSearchPage, SpellSearchParams } from './types';

/** Mirrors SPELL_PAGE_SIZE in the backend's spells.schemas.ts. */
export const SPELL_PAGE_SIZE = 20;

/**
 * The shared reference library, not scoped to a character — the only
 * non-character query in the app. Adding a found spell goes back through
 * `/character/:id/spells`.
 */
export const searchSpells = ({
  q,
  characterClass,
  maxLevel,
  offset = 0,
}: SpellSearchParams): Promise<SpellSearchPage> => {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(SPELL_PAGE_SIZE),
  });

  if (q) {
    params.set('q', q);
  }

  if (characterClass) {
    params.set('class', characterClass);
  }

  if (maxLevel !== undefined) {
    params.set('maxLevel', String(maxLevel));
  }

  return http.get<SpellSearchPage>(`/spells/search?${params.toString()}`);
};
