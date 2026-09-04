/**
 * The five numbers, not the sheet they sit on: an object prop changes identity on
 * every sheet edit, so `sheet` re-rendered the whole strip on an unrelated one.
 */
export interface StatFieldsProps {
  hpCurrent: number;
  hpMax: number;
  tempHp: number;
  ac: number;
  speed: number;
}

/** The numeric sheet fields the header edits in place. */
export type SheetStatField = keyof StatFieldsProps;
