import type { ClassResource } from '@shared/api/characters';

export interface ResourcesListProps {
  resources: ClassResource[];
  isSaving?: boolean;
}
