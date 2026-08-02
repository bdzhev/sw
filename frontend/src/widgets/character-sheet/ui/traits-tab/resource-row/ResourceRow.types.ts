import type { ClassResource } from '@shared/api/characters';

export interface ResourceRowProps {
  resource: ClassResource;
  isSaving?: boolean;
}
