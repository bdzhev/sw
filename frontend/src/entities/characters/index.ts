export { useCharacterSummaries } from './model/useCharacterSummaries';
export { useCreateCharacter } from './model/useCreateCharacter';
export { useDeleteCharacter } from './model/useDeleteCharacter';
export { useUpdateCharacter } from './model/useUpdateCharacter';
export { useCharacter } from './model/useCharacter';
export { useCharacterCollection } from './model/useCharacterCollection';
export { useSheetAutosave } from './model/useSheetAutosave';
export type { SaveState } from './model/useSheetAutosave';

export {
  MAX_SLOT_LEVEL,
  HIT_DIE_BY_CLASS,
  SPELLCASTING_ABILITY_BY_CLASS,
  SAVE_PROFICIENCIES_BY_CLASS,
  SPEED_BY_RACE,
  DEFAULT_PROGRESSION_BY_CLASS,
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  THIRD_CASTER_SLOTS,
  PACT_MAGIC_SLOTS,
} from './config/class-tables';
export type { PactMagicSlots, SlotTableMaxima } from './config/class-tables';

export {
  proficiencyBonusForLevel,
  slotMaximaFromProgression,
  resolveSpellcastingAbility,
} from './model/class-tables';

export {
  abilityScores,
  abilityModifier,
  bonusesFromItems,
  totalAbilityScores,
  withItemBonuses,
  proficiencyBonus,
  savingThrowTotal,
  savingThrowModifier,
  skillTotal,
  skillModifier,
  passivePerception,
  initiativeTotal,
  initiativeFrom,
  hitDiceTotal,
  spellSaveDc,
  spellAttackBonus,
  spellSlotMaxima,
  availableSlotLevels,
  type AbilityScores,
  type SlotMaxima,
} from './model/derived-stats';

export { ABILITIES } from './config/abilities';
export type { AbilityDescriptor, AbilitySheetField } from './config/abilities';

export { abilityLabels, abilityShortLabels, abilitySheetFields } from './lib/abilities';

export {
  SKILLS,
  PERCEPTION_SKILL_KEY,
  STANDARD_LANGUAGES,
  type SkillDefinition,
} from './config/skills';
