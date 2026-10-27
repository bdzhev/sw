import { inject } from 'vue';

import { SHEET_CTX_KEY } from '@widgets/character-sheet/config/sheet';
import type { SheetContext } from '@widgets/character-sheet/model/sheet-shell';

/**
 * The character, its sheet and the one way to write to it.
 *
 * Throws rather than returning `undefined`: every consumer is rendered inside a
 * surface that provides this, so an absent context is a wiring bug and a silent
 * `undefined` would surface as a blank tab instead.
 */
export const useSheetContext = (): SheetContext => {
  const ctx = inject(SHEET_CTX_KEY);

  if (!ctx) {
    throw new Error('useSheetContext: no sheet surface above this component');
  }

  return ctx;
};
