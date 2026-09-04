import type { CharacterSpell } from '@shared/api/characters';

export interface SpellDetailDialogProps {
  /** null between openings — the dialog stays mounted. */
  spell: CharacterSpell | null;
}
