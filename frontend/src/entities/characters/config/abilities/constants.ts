import { CharacterStat } from '@shared/api/characters';

import type { AbilityDescriptor } from './types';

/**
 * The six abilities in paper-sheet order (STR → CHA), which is not the enum's
 * declaration order.
 *
 * This lives in the entity rather than in a tab because the main tab, the skills
 * tab and anything else that labels an ability need the same strings — it was
 * briefly written twice, once per tab, which is how labels drift apart.
 *
 * The label and field maps are *derived* from this, so they live in
 * `lib/abilities` and are named as the worked-out values they are.
 */
export const ABILITIES: readonly AbilityDescriptor[] = [
  { stat: CharacterStat.STR, field: 'str', abbr: 'STR', name: 'Strength' },
  { stat: CharacterStat.DEX, field: 'dex', abbr: 'DEX', name: 'Dexterity' },
  { stat: CharacterStat.CON, field: 'con', abbr: 'CON', name: 'Constitution' },
  { stat: CharacterStat.INT, field: 'intScore', abbr: 'INT', name: 'Intelligence' },
  { stat: CharacterStat.WIS, field: 'wis', abbr: 'WIS', name: 'Wisdom' },
  { stat: CharacterStat.CHA, field: 'cha', abbr: 'CHA', name: 'Charisma' },
];
