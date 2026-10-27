import type { CastableSlot } from '@widgets/character-sheet/lib/spellcasting';

export interface SlotSummaryProps {
  /** Only the levels the character actually has a pool at — see `slotPools`. */
  pools: CastableSlot[];
}
