import type { CharacterIdentity, CharacterSheet } from '@shared/api/characters';

export interface SheetHeaderProps {
  character: CharacterIdentity;
  sheet: CharacterSheet;
}
