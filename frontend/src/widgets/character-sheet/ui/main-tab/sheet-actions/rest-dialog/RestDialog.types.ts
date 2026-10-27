import type { RestType } from '@shared/api/characters';

export interface RestDialogProps {
  /** Which rest this instance is for — the two buttons each own one. */
  type: RestType;
}
