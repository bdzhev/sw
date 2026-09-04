import type { Attack } from '@shared/api/characters';

import type { AbilityScores } from '@entities/characters';

export interface AttackDialogProps {
  open: boolean;
  /** Null = add mode. One dialog serves both, per the design doc. */
  attack: Attack | null;
  /** Only the live preview needs these; scanned once by the tab. */
  totals: AbilityScores;
  proficiencyBonus: number;
  isSaving?: boolean;
}
