import type { CharacterClass, CharacterSheet } from '@shared/api/characters';

export interface HitDiceProps {
  sheet: CharacterSheet;
  /** Die size is fixed by class, so it is derived rather than entered. */
  characterClass: CharacterClass;
}
