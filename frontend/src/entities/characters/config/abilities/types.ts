import type { CharacterStat } from '@shared/api/characters';

/** The sheet row stores INT as `intScore`; the other five match the enum value. */
export type AbilitySheetField = 'str' | 'dex' | 'con' | 'intScore' | 'wis' | 'cha';

export interface AbilityDescriptor {
  stat: CharacterStat;
  /** Which `CharacterSheet` column holds the raw score. */
  field: AbilitySheetField;
  abbr: string;
  name: string;
}
