import type { CharacterClass } from '@shared/api/characters';

export interface AddSpellDialogProps {
  open: boolean;
  characterClass: CharacterClass | null;
  /** Ceiling for the class search. 0 still lets cantrips through. */
  maxCastableLevel: number;
  addedSpellIds: Set<string>;
  isSaving?: boolean;
}
