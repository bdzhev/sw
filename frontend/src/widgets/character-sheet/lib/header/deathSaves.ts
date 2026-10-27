import type { CharacterSheet, SheetPatch } from '@shared/api/characters';

/**
 * Regaining any hit point ends the dying state, so the marks go with it.
 *
 * Folded into the patch that raises hp rather than driven by a `watch` on
 * `hpCurrent`: that watcher would also fire on the server's acked write-back,
 * which is a write triggered by a read. One patch, absolute values, one cause.
 */
export const withDeathSaveReset = (
  patch: SheetPatch,
  sheet: CharacterSheet,
): SheetPatch => {
  const isRevived = patch.hpCurrent !== undefined && patch.hpCurrent > 0;
  const wasDying = sheet.hpCurrent === 0;
  const hasMarks = sheet.deathSaveSuccesses > 0 || sheet.deathSaveFailures > 0;

  if (!isRevived || !wasDying || !hasMarks) {
    return patch;
  }

  return { ...patch, deathSaveSuccesses: 0, deathSaveFailures: 0 };
};
