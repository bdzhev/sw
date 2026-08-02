import type { ClassResource } from '@shared/api/characters';

export interface SpendDialogProps {
  open: boolean;
  resource: ClassResource;
  isSaving?: boolean;
}
