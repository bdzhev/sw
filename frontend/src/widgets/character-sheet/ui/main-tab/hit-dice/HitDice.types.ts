import type { CharacterClass } from '@shared/api/characters';

export interface HitDiceProps {
  /** No multiclassing, so the hit-dice total is always the level. */
  level: number;
  hitDiceRemaining: number;
  /** Die size is fixed by class, so it is derived rather than entered. */
  characterClass: CharacterClass;
}
