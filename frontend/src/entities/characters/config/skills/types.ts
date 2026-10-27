import type { CharacterStat } from '@shared/api/characters';

export interface SkillDefinition {
  key: string;
  label: string;
  ability: CharacterStat;
}
