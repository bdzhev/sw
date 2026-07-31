import type { SheetPatch } from '@shared/api/characters';

/**
 * Autosave targets are keyed so a counter edit on one resource never shares a
 * flush with the sheet row. `character` is the `character_sheets` row; the
 * sub-entity forms land as wave-2 tabs add their endpoints.
 */
export type AutosaveTarget = 'character';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Absolute field values, never deltas — a resend must be idempotent. */
export type TargetPatch = SheetPatch;

/**
 * What the localStorage buffer holds. `baseSeq` is the `lastWriteSeq` of the
 * server row the buffer was derived from: on hydrate the buffer is discarded
 * whole if the fetched row is newer, because replaying it would resurrect
 * pre-rest values and silently undo an atomic action.
 */
export interface BufferedPatch {
  characterId: string;
  baseSeq: number;
  patch: TargetPatch;
}
