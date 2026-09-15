import { computed, ref, watch } from 'vue';

import {
  RestType,
  SpellcastingProgression,
  type RestPayload,
  type RestResult,
} from '@shared/api/characters';
import { getApiErrorMessage } from '@shared/lib/http';
import { useToast } from '@shared/lib/ui';

import {
  PACT_SLOTS_HINT,
  REST_ERROR_TITLE,
  SHORT_REST_SLOTS_HINT,
} from '@widgets/character-sheet/config/rest';
import type { RestSummaryLine } from '@widgets/character-sheet/config/rest';
import { restSummary } from '@widgets/character-sheet/lib/rest';
import type { RestSnapshot } from '@widgets/character-sheet/lib/rest';
import { useSheetContext } from '@widgets/character-sheet/model/sheet-shell';

import type { UseRest, UseRestOptions } from './useRest.types';

const ERROR_FALLBACK = 'Please try again.';

/**
 * One rest, from the tap to the summary.
 *
 * The endpoint returns the new state but no summary: the wording is a UI
 * concern, and the client already holds both halves — the cache as it was
 * before the action, the response after it. So the snapshot is taken here,
 * before `runAction` (which flushes and freezes autosave, then adopts what
 * comes back).
 */
export const useRest = (options: UseRestOptions): UseRest => {
  const { isOpen } = options;

  const { character, sheet, runAction } = useSheetContext();
  const { showToast } = useToast();

  const isResting = ref(false);
  const summary = ref<RestSummaryLine[]>([]);

  const hasRested = computed(() => {
    return summary.value.length > 0;
  });

  const remainingDice = computed(() => {
    return sheet.value?.hitDiceRemaining ?? 0;
  });

  const slotsHint = computed(() => {
    const row = sheet.value;

    if (!row) {
      return null;
    }

    if (row.spellcastingProgression === SpellcastingProgression.PACT) {
      return PACT_SLOTS_HINT;
    }

    // A character with no pool at all does not need telling about slots. The
    // `custom`-progression warlock does, which is why this reads the pool
    // rather than the class.
    const hasPool = Object.keys(row.spellSlots.max ?? {}).length > 0;

    return hasPool ? SHORT_REST_SLOTS_HINT : null;
  });

  const snapshot = (): RestSnapshot | null => {
    const detail = character.value;

    if (!detail) {
      return null;
    }

    return {
      sheet: detail.sheet,
      classResources: detail.classResources,
      inventoryItems: detail.inventoryItems,
    };
  };

  const rest = async (payload: RestPayload): Promise<boolean> => {
    const before = snapshot();

    /** No character yet, or one already out — a double tap must not rest twice. */
    if (!before || isResting.value) {
      return false;
    }

    isResting.value = true;

    try {
      const after = await runAction<RestResult>('rest', payload);

      summary.value = restSummary(payload.type, before, after);

      return true;
    } catch (error) {
      showToast({
        title: REST_ERROR_TITLE,
        description: getApiErrorMessage(error, ERROR_FALLBACK),
        variant: 'error',
      });

      return false;
    } finally {
      isResting.value = false;
    }
  };

  const restShort = (diceSpent: number, healingRolled: number): Promise<boolean> => {
    return rest({ type: RestType.SHORT, diceSpent, healingRolled });
  };

  const restLong = (): Promise<boolean> => {
    return rest({ type: RestType.LONG });
  };

  /**
   * Cleared on open rather than on close: the dialog animates out, and clearing
   * it on the way out swaps the summary back to the form mid-animation.
   */
  watch(isOpen, (open) => {
    if (open) {
      summary.value = [];
    }
  });

  return { isResting, summary, hasRested, remainingDice, slotsHint, restShort, restLong };
};
