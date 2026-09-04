import type { AbilityDescriptor } from '@entities/characters';

export interface AbilityScoreProps {
  /** Carries its own `field`, so the row emits an edit the parent can apply blind. */
  ability: AbilityDescriptor;
  /** The stored raw score — the only editable half. */
  score: number;
  /** Raw score plus equipped-item bonuses; equals `score` when there are none. */
  total: number;
  /** Derived from `total`, so gear is reflected in what the player rolls with. */
  modifier: number;
}
