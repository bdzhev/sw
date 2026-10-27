/** 0 = neither, 1 = proficient, 2 = expertise. Mirrors the stored multiplier. */
export type SkillProficiencyLevel = 0 | 1 | 2;

/** One rendered skill row — everything already resolved, no math left in the UI. */
export interface SkillRowView {
  key: string;
  label: string;
  abilityLabel: string;
  modifier: number;
  proficiency: SkillProficiencyLevel;
}

export interface SkillGroupView {
  ability: string;
  label: string;
  skills: SkillRowView[];
}
