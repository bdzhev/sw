import type { SheetPatch } from '@shared/api/characters';

/**
 * What the localStorage buffer holds. `baseSeq` is the `lastWriteSeq` of the server
 * row the buffer was derived from; the staleness check in `takeBufferFor` is the
 * only reason it is stored.
 */
export interface BufferedPatch {
  characterId: string;
  baseSeq: number;
  patch: SheetPatch;
}
