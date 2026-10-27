import type { Trait } from '@shared/api/characters';

export interface TraitDialogProps {
  /** null = the dialog is adding rather than editing. */
  trait: Trait | null;
  isSaving?: boolean;
}
