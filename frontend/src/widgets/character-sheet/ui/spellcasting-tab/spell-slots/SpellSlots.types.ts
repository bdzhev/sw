import type { SpellSlots as SpellSlotsValue } from '@shared/api/characters';

export interface SpellSlotsProps {
  slots: SpellSlotsValue;
  /** Labels the section and notes short-rest recovery. Drives nothing else. */
  isPactMagic: boolean;
  /** Offers the class-table maxima in one tap. Absent when the class has none. */
  tableMaxima: Partial<Record<string, number>> | null;
}
