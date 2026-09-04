import type { SkillProficiencyLevel } from '@widgets/character-sheet/config/skills';

/**
 * Five primitives rather than one `SkillRowView`: Vue compares prop *values*, so
 * an unchanged row only skips its render if nothing it receives is an object.
 */
export interface SkillRowProps {
  skillKey: string;
  label: string;
  abilityLabel: string;
  modifier: number;
  proficiency: SkillProficiencyLevel;
}
