import type { SaveState } from '@entities/characters';

/**
 * `pending` is not a save state — it is idle *with* buffered edits, which the
 * two-second debounce makes a visible condition rather than a transient one.
 */
export type StatusKey = SaveState | 'pending';

export interface StatusBarProps {
  saveState: SaveState;
  hasUnsavedChanges?: boolean;
}
