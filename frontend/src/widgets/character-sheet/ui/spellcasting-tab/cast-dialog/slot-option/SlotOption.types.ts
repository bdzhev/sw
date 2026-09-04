import type { CastableSlot } from '@widgets/character-sheet/lib/spellcasting';

export interface SlotOptionProps {
  /** Named `castableSlot`, not `slot` — Vue still treats a bare `slot` attribute specially. */
  castableSlot: CastableSlot;
  isSaving?: boolean;
}
