import type { CharacterSpell } from '@shared/api/characters';

export interface SpellDetailDialogProps {
  open: boolean;
  /** null between openings — the dialog stays mounted. */
  spell: CharacterSpell | null;
}
