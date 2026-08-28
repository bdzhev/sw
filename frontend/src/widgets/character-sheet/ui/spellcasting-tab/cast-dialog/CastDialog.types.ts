import type { SpellSlots } from '@shared/api/characters';

export interface CastDialogProps {
  open: boolean;
  spellName: string;
  /** null between openings — the dialog stays mounted. */
  spellLevel: number | null;
  slots: SpellSlots;
  isSaving?: boolean;
}
