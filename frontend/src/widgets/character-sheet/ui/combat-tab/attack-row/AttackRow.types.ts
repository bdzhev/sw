import type { Attack } from '@shared/api/characters';

import type { AbilityScores } from '@entities/characters';

export interface AttackRowProps {
  attack: Attack;
  /** Scanned once by the tab, not per row — see `useAbilityTotals`. */
  totals: AbilityScores;
  /** The level-derived bonus; the row never needs the level itself. */
  proficiencyBonus: number;
  /** A write is in flight, so the row's own controls stop accepting taps. */
  isBusy?: boolean;
}
