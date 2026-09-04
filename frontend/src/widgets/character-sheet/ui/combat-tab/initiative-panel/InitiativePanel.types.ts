import type { AbilityScores } from '@entities/characters';

export interface InitiativePanelProps {
  /** Equipped items shift the dex score, so the tab's totals are what feed this. */
  totals: AbilityScores;
  initiativeBonus: number;
}
