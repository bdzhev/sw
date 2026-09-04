import type { CharacterStat, SpellcastingProgression } from '@shared/api/characters';

export interface SpellcastingStatsProps {
  /** null when the class casts nothing and progression was not overridden. */
  ability: CharacterStat | null;
  saveDc: number | null;
  attackBonus: number | null;
  /** The control that drives the three values above it. */
  progression: SpellcastingProgression;
}
