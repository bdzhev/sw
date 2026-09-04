import { CharacterStat } from '@shared/api/characters';

export interface SkillDefinition {
  key: string;
  label: string;
  ability: CharacterStat;
}

/**
 * The 18 skills and their governing ability. Which of them a character is
 * proficient in is player-entered — the app deliberately does not know which
 * skills a rogue is "supposed" to have, and expertise is offered on every row
 * regardless of class.
 */
export const SKILLS: readonly SkillDefinition[] = [
  { key: 'athletics', label: 'Athletics', ability: CharacterStat.STR },
  { key: 'acrobatics', label: 'Acrobatics', ability: CharacterStat.DEX },
  { key: 'sleightOfHand', label: 'Sleight of Hand', ability: CharacterStat.DEX },
  { key: 'stealth', label: 'Stealth', ability: CharacterStat.DEX },
  { key: 'arcana', label: 'Arcana', ability: CharacterStat.INT },
  { key: 'history', label: 'History', ability: CharacterStat.INT },
  { key: 'investigation', label: 'Investigation', ability: CharacterStat.INT },
  { key: 'nature', label: 'Nature', ability: CharacterStat.INT },
  { key: 'religion', label: 'Religion', ability: CharacterStat.INT },
  { key: 'animalHandling', label: 'Animal Handling', ability: CharacterStat.WIS },
  { key: 'insight', label: 'Insight', ability: CharacterStat.WIS },
  { key: 'medicine', label: 'Medicine', ability: CharacterStat.WIS },
  { key: 'perception', label: 'Perception', ability: CharacterStat.WIS },
  { key: 'survival', label: 'Survival', ability: CharacterStat.WIS },
  { key: 'deception', label: 'Deception', ability: CharacterStat.CHA },
  { key: 'intimidation', label: 'Intimidation', ability: CharacterStat.CHA },
  { key: 'performance', label: 'Performance', ability: CharacterStat.CHA },
  { key: 'persuasion', label: 'Persuasion', ability: CharacterStat.CHA },
];

export const PERCEPTION_SKILL_KEY = 'perception';

/** Hardcoded per `design/tabs/skills.md`, plus a freeform "other" field. */
export const STANDARD_LANGUAGES: readonly string[] = [
  'Common',
  'Dwarvish',
  'Elvish',
  'Giant',
  'Gnomish',
  'Goblin',
  'Halfling',
  'Orc',
  'Abyssal',
  'Celestial',
  'Deep Speech',
  'Draconic',
  'Infernal',
  'Primordial',
  'Sylvan',
  'Undercommon',
];
