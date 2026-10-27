import type { Attack } from '@shared/api/characters';

import type { AbilityScores } from '@entities/characters';

export interface AttackDetailDialogProps {
  /** Null while closed — the dialog holds no copy of the row. */
  attack: Attack | null;
  /** Scanned once by the tab; the dialog only reads the breakdown off it. */
  totals: AbilityScores;
  proficiencyBonus: number;
}
