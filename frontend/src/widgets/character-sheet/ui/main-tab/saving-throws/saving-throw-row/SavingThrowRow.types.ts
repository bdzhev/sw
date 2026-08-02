import type { AbilityDescriptor } from '@entities/characters';

export interface SavingThrowRowProps {
  /** Carries its own `stat`, so the row emits a toggle the table can apply blind. */
  ability: AbilityDescriptor;
  isProficient: boolean;
  /** Ability modifier plus the proficiency bonus when proficient. */
  total: number;
}
