import type { CharacterSheet } from '@shared/api/characters';

export interface StatFieldsProps {
  sheet: CharacterSheet;
}

/** The numeric sheet fields the header edits in place. */
export type SheetStatField = 'hpCurrent' | 'hpMax' | 'tempHp' | 'ac' | 'speed';
