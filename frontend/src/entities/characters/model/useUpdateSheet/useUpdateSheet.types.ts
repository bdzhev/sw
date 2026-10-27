import type { SheetPatch } from '@shared/api/characters';

export interface UpdateSheetVariables {
  id: string;
  patch: SheetPatch;
}
