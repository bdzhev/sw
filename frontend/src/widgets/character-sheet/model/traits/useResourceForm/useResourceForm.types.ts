import type { ClassResource, ResetTrigger } from '@shared/api/characters';

/** What the dialog hands back — already shaped like a `resources` create/patch body. */
export interface ResourceSubmitValues {
  resourceKey: string;
  /**
   * True for a homebrew pool *and* for a known one the player gave a max to:
   * the row shape allows a non-null `maxValue` only when this is set, and the
   * known-maxima table does not exist yet.
   */
  isCustom: boolean;
  maxValue: number | null;
  current: number;
  resetTrigger: ResetTrigger;
  description: string | null;
  quickReference: boolean;
}

export interface UseResourceFormOptions {
  /** null while adding rather than editing. */
  getResource: () => ClassResource | null;
  isOpen: () => boolean;
  onSubmit: (values: ResourceSubmitValues) => void;
}
