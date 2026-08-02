import type { ClassResource } from '@shared/api/characters';

export interface ResourceDialogProps {
  open: boolean;
  /** null = the dialog is adding rather than editing. */
  resource: ClassResource | null;
  isSaving?: boolean;
}
