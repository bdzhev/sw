import type { RouteLocationRaw } from 'vue-router';

import type { CharacterIdentity, CharacterSheet } from '@shared/api/characters';

export interface SheetHeaderProps {
  character: CharacterIdentity;
  sheet: CharacterSheet;
  /** Passed in rather than built here, so the header owns no route knowledge. */
  itemsLink: RouteLocationRaw;
  settingsLink: RouteLocationRaw;
}
