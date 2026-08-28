import type { CharacterStat } from '@shared/api/characters';

export interface SpellcastingStatsProps {
  /** null when the class casts nothing and progression was not overridden. */
  ability: CharacterStat | null;
  saveDc: number | null;
  attackBonus: number | null;
}
