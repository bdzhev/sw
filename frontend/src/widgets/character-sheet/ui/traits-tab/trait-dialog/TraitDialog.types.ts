import type { Trait } from '@shared/api/characters';

export interface TraitDialogProps {
  open: boolean;
  /** null = the dialog is adding rather than editing. */
  trait: Trait | null;
  isSaving?: boolean;
}
