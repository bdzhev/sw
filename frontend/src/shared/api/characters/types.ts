export enum CharacterClass {
  BARBARIAN = 'barbarian',
  BARD = 'bard',
  CLERIC = 'cleric',
  DRUID = 'druid',
  FIGHTER = 'fighter',
  MONK = 'monk',
  PALADIN = 'paladin',
  RANGER = 'ranger',
  ROGUE = 'rogue',
  SORCERER = 'sorcerer',
  WARLOCK = 'warlock',
  WIZARD = 'wizard',
}

/**
 * `PENDING` = the quiz has not generated scores yet, so the sheet route sends
 * those to the quiz. Setup state is `setupCompletedAt`, not a third status.
 */
export enum CharacterStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
}

export enum CharacterStat {
  STR = 'str',
  DEX = 'dex',
  WIS = 'wis',
  INT = 'int',
  CHA = 'cha',
  CON = 'con',
}

export enum CharacterRace {
  HUMAN = 'human',
  ELF = 'elf',
  DWARF = 'dwarf',
  HALFLING = 'halfling',
  GNOME = 'gnome',
  HALF_ORC = 'half-orc',
  TIEFLING = 'tiefling',
  DRAGONBORN = 'dragonborn',
  HALF_ELF = 'half-elf',
}

/** The projected row `GET /characters` returns — the collection endpoint. */
export interface CharacterSummary {
  id: string;
  name: string;
  characterClass: CharacterClass;
  race: CharacterRace;
  status: CharacterStatus;
}

/** The identity row. Edited explicitly (settings form), never by autosave. */
export interface CharacterIdentity extends CharacterSummary {
  lore: string | null;
  appearance: string | null;
  createdAt: string;
}

export enum SpellcastingProgression {
  FULL = 'full',
  HALF = 'half',
  THIRD = 'third',
  PACT = 'pact',
  NONE = 'none',
  CUSTOM = 'custom',
}

/** `max` is present only for `custom` progression; otherwise it is derived. */
export interface SpellSlots {
  current: Partial<Record<string, number>>;
  max?: Partial<Record<string, number>>;
}

export interface Languages {
  standard: string[];
  other: string;
}

/** 1 = proficient, 2 = expertise. Absent = neither. */
export type SkillProficiencies = Partial<Record<string, 1 | 2>>;

/**
 * The 1:1 play-state row. This whole object is the autosave controller's
 * `character` target, and the controller is its only writer.
 *
 * Everything derivable from it is absent on purpose — modifiers, proficiency
 * bonus, save/skill totals, passive perception, initiative total, spell save DC,
 * slot maxima and resource maxima are computed in `entities/characters`.
 */
export interface CharacterSheet {
  characterId: string;
  /** Read-only outside the level-up action. */
  level: number;
  str: number;
  dex: number;
  con: number;
  intScore: number;
  wis: number;
  cha: number;
  saveProficiencies: CharacterStat[];
  skillProficiencies: SkillProficiencies;
  hpCurrent: number;
  /** Stored, not derived: hp per level is rolled by the player. */
  hpMax: number;
  tempHp: number;
  ac: number;
  speed: number;
  initiativeBonus: number;
  inspiration: boolean;
  hitDiceRemaining: number;
  deathSaveSuccesses: number;
  deathSaveFailures: number;
  conditions: string[];
  languages: Languages;
  spellcastingProgression: SpellcastingProgression;
  spellSlots: SpellSlots;
  gp: number;
  sp: number;
  cp: number;
  /** null = the post-quiz setup flow has not run. */
  setupCompletedAt: string | null;
  lastWriteSeq: number;
  updatedAt: string;
}

export enum AttackAbility {
  STRENGTH = 'strength',
  DEXTERITY = 'dexterity',
  /** `max(strMod, dexMod)` — the same ability for attack and damage. */
  FINESSE = 'finesse',
}

export enum AttackDelivery {
  MELEE = 'melee',
  THROWN = 'thrown',
  RANGED_BOW = 'ranged-bow',
  RANGED_FIREARM = 'ranged-firearm',
}

/** Shared by the four pinnable collections; read as a union by quick access. */
interface Pinnable {
  quickReference: boolean;
  pinOrder: number;
}

interface SubEntity {
  id: string;
  characterId: string;
  sortOrder: number;
  createdAt: string;
}

export interface Attack extends SubEntity, Pinnable {
  name: string;
  ability: AttackAbility;
  delivery: AttackDelivery;
  proficient: boolean;
  damageDice: string | null;
  damageType: string | null;
  additionalBonus: number;
  ammoRemaining: number | null;
  properties: string[];
}

export enum TraitTag {
  RACE = 'race',
  CLASS = 'class',
  OTHER = 'other',
}

export interface Trait extends SubEntity, Pinnable {
  name: string;
  description: string | null;
  tag: TraitTag;
}

export enum ResetTrigger {
  SHORT = 'short',
  LONG = 'long',
  BOTH = 'both',
  MANUAL = 'manual',
}

export interface ClassResource extends SubEntity, Pinnable {
  resourceKey: string;
  isCustom: boolean;
  /** null unless `isCustom` — known resources derive their max at render. */
  maxValue: number | null;
  current: number;
  resetTrigger: ResetTrigger;
  description: string | null;
}

export interface InventoryItem extends SubEntity, Pinnable {
  name: string;
  description: string | null;
  quantity: number;
  maxUses: number | null;
  usesRemaining: number | null;
  resetOnLongRest: boolean;
  /** Only counts while `isEquipped`; totals are derived, never stored. */
  statModifiers: Partial<Record<CharacterStat, number>>;
  isEquipped: boolean;
}

export interface SpellReference {
  id: string;
  slug: string;
  name: string;
  level: number;
  school: string | null;
  classes: string[];
  castingTime: string | null;
  rangeText: string | null;
  components: string[];
  duration: string | null;
  concentration: boolean;
  ritual: boolean;
  description: string | null;
  higherLevel: string | null;
}

/** `spellId === null` is the custom marker; `isCustom` is computed server-side. */
export interface CharacterSpell {
  id: string;
  spellId: string | null;
  customName: string | null;
  customDescription: string | null;
  sortOrder: number;
  createdAt: string;
  spell: SpellReference | null;
  isCustom: boolean;
}

/** Everything `GET /character/:id` returns. */
export interface CharacterDetail {
  character: CharacterIdentity;
  sheet: CharacterSheet;
  attacks: Attack[];
  traits: Trait[];
  classResources: ClassResource[];
  inventoryItems: InventoryItem[];
  spells: CharacterSpell[];
}

/** `total` is the user's full character count, not the page length. */
export interface CharactersPage {
  items: CharacterSummary[];
  total: number;
}

export type CreateCharacterPayload = Omit<CharacterSummary, 'status' | 'id'>;

/** Partial by design — the route accepts any non-empty subset. */
export interface UpdateCharacterPayload {
  id: string;
  name?: string;
  lore?: string;
  appearance?: string;
}

/** Only the fields the autosave controller is allowed to write. */
export type SheetPatch = Partial<
  Omit<
    CharacterSheet,
    'characterId' | 'level' | 'setupCompletedAt' | 'lastWriteSeq' | 'updatedAt'
  >
>;
