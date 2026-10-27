/** The three coin columns, not the sheet row they sit on. */
export interface CurrencyFieldsProps {
  gp: number;
  sp: number;
  cp: number;
}

export type CurrencyField = 'gp' | 'sp' | 'cp';

export interface CoinDescriptor {
  field: CurrencyField;
  /** The visible caption. */
  abbr: string;
  /** The accessible name — the caption alone is jargon to a screen reader. */
  label: string;
  /** A coin colour token, not a semantic one. See main.css. */
  colorClass: string;
}
