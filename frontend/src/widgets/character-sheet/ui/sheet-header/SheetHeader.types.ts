import type { CharacterIdentity, CharacterSheet } from '@shared/api/characters';

export interface SheetHeaderProps {
  character: CharacterIdentity;
  sheet: CharacterSheet;
}

/** The numeric sheet fields the header edits in place. */
export type SheetStatField = 'hpCurrent' | 'hpMax' | 'tempHp' | 'ac' | 'speed';
