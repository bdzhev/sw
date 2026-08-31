import type { CharacterSheet } from '@shared/api/characters';

export interface CurrencyFieldsProps {
  sheet: CharacterSheet;
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
