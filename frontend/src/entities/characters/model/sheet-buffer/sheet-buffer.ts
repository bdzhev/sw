import type { CharacterSheet, SheetPatch } from '@shared/api/characters';

import type { BufferedPatch } from './sheet-buffer.types';

const bufferKey = (characterId: string): string => {
  return `sheetBuffer:${characterId}`;
};

/**
 * The pending patch, mirrored to localStorage so a mid-combat refresh or crash does
 * not lose an unsaved hp change. This app is for in-person play on possibly-spotty
 * wifi, so local state is the session's source of truth.
 *
 * `baseSeq` is the `lastWriteSeq` of the server row the patch was derived from, and
 * it is the entire point of the record - see `takeBufferFor`.
 *
 * Writes are wrapped because `setItem` throws rather than no-ops when storage is
 * unavailable (a private window, a full quota), and losing the safety net must not
 * take the edit down with it.
 */
export const writeBuffer = (id: string, baseSeq: number, patch: SheetPatch): void => {
  const buffered: BufferedPatch = { characterId: id, baseSeq, patch };

  try {
    localStorage.setItem(bufferKey(id), JSON.stringify(buffered));
  } catch {
    /* no buffer is worse than no edit, but not by much - carry on */
  }
};

export const clearBuffer = (id: string): void => {
  localStorage.removeItem(bufferKey(id));
};

/**
 * The hydrate rule, whole: replay a buffer only if it was derived from the exact row
 * that was just fetched. A buffer with an older base is discarded outright - server
 * wins, no merge, no prompt - because replaying it would resurrect pre-rest values
 * and silently undo an atomic action.
 *
 * A *matching* buffer is left in place rather than consumed. The patch it holds is
 * about to become the controller's pending copy, which is not durable until it acks,
 * and the ack is what clears the buffer.
 */
export const takeBufferFor = (id: string, sheet: CharacterSheet): SheetPatch | null => {
  const raw = localStorage.getItem(bufferKey(id));

  if (!raw) {
    return null;
  }

  try {
    const buffered = JSON.parse(raw) as BufferedPatch;

    if (buffered.characterId !== id || buffered.baseSeq !== sheet.lastWriteSeq) {
      clearBuffer(id);

      return null;
    }

    return buffered.patch;
  } catch {
    clearBuffer(id);

    return null;
  }
};
