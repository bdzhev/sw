import type { QueryClient } from '@tanstack/vue-query';

import {
  characterQueries,
  type CharacterDetail,
  type CharacterSheet,
  type SheetPatch,
} from '@shared/api/characters';

/**
 * Every way the autosave controller touches the character cache, in one place, so
 * the store reads as scheduling rather than as `setQueryData` boilerplate.
 *
 * The cache *is* the sheet's working copy - there is no second dirty copy layered
 * over it - so outside a fetch these are its only writers.
 */

export const readCachedDetail = (
  qc: QueryClient,
  id: string,
): CharacterDetail | undefined => {
  return qc.getQueryData<CharacterDetail>(characterQueries.character(id));
};

/** Replaces the sheet wholesale. For a row that came back from the server. */
export const writeCachedSheet = (
  qc: QueryClient,
  id: string,
  sheet: CharacterSheet,
): void => {
  qc.setQueryData(characterQueries.character(id), (old: CharacterDetail | undefined) => {
    return old ? { ...old, sheet } : old;
  });
};

/**
 * Echoes a queued edit into the cache. Without it a controlled input re-reads the
 * pre-edit server value on blur and appears to throw away what was typed, right up
 * until the ack lands a debounce later.
 *
 * `lastWriteSeq` is deliberately not touched: the server owns it, and the buffer
 * records it as the base for its staleness check.
 */
export const mergeCachedSheet = (
  qc: QueryClient,
  id: string,
  patch: SheetPatch,
): void => {
  qc.setQueryData(characterQueries.character(id), (old: CharacterDetail | undefined) => {
    return old ? { ...old, sheet: { ...old.sheet, ...patch } } : old;
  });
};
