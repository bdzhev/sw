import type { Trait, TraitTag } from '@shared/api/characters';

/** What the dialog hands back — already shaped like a `traits` create/patch body. */
export interface TraitSubmitValues {
  name: string;
  description: string | null;
  tag: TraitTag;
  quickReference: boolean;
}

export interface UseTraitFormOptions {
  /** null while adding rather than editing. */
  getTrait: () => Trait | null;
  isOpen: () => boolean;
  onSubmit: (values: TraitSubmitValues) => void;
}
