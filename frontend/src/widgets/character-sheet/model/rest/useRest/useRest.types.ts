import type { ComputedRef, Ref } from 'vue';

import type { RestSummaryLine } from '@widgets/character-sheet/config/rest';

export interface UseRestOptions {
  /** The dialog's own open state: reopening it clears the last summary. */
  isOpen: () => boolean;
}

export interface UseRest {
  isResting: Ref<boolean>;
  /** Empty until a rest lands; the dialog switches to its summary step on it. */
  summary: Ref<RestSummaryLine[]>;
  hasRested: ComputedRef<boolean>;
  remainingDice: ComputedRef<number>;
  /** What a short rest will or will not do to this character's slots. */
  slotsHint: ComputedRef<string | null>;
  /** Both resolve to whether the rest actually applied. */
  restShort: (diceSpent: number, healingRolled: number) => Promise<boolean>;
  restLong: () => Promise<boolean>;
}
