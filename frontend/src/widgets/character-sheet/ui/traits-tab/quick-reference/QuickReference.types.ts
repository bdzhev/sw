import type { ClassResource, Trait } from '@shared/api/characters';

export interface QuickReferenceProps {
  traits: Trait[];
  resources: ClassResource[];
  isSaving?: boolean;
}
