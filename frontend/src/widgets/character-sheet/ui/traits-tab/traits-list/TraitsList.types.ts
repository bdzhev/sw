import type { Trait } from '@shared/api/characters';

export interface TraitsListProps {
  traits: Trait[];
  isSaving?: boolean;
}
