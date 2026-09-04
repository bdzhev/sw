import type { CharacterStat } from '@shared/api/characters';

import type { AbilityScores } from '@entities/characters';

export interface SavingThrowsProps {
  totals: AbilityScores;
  /** The level-derived bonus, so the row need not be asked for the level. */
  proficiencyBonus: number;
  saveProficiencies: CharacterStat[];
  /** Shown beside the bonus; the only reason this needs the level at all. */
  level: number;
}
