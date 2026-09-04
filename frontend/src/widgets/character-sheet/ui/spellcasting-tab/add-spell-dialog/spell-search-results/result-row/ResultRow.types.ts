import type { SpellReference } from '@shared/api/spells';

export interface ResultRowProps {
  spell: SpellReference;
  /** Nothing in the schema forbids the same spell twice, so the row says so. */
  isAdded: boolean;
  isSaving?: boolean;
}
