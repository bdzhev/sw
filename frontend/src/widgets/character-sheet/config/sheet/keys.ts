import type { InjectionKey } from 'vue';

import type { SheetContext } from '@widgets/character-sheet/model/sheet-shell';

/**
 * Typed key, so `inject` needs no cast and no non-null assertion at the call
 * site. Lives in `config/` with the other constants.
 */
export const SHEET_CTX_KEY: InjectionKey<SheetContext> = Symbol('sheetContext');
