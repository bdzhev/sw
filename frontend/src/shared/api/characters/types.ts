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

export enum CharacterStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
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

export interface BaseCharacterData {
  id: string;
  name: string;
  characterClass: CharacterClass;
  race: CharacterRace;
  status: CharacterStatus;
}

type CharacterStats = Record<CharacterStat, number> | null;

export interface CharacterData extends BaseCharacterData {
  stats: CharacterStats;
}

export type RawBaseCharacterData = Omit<BaseCharacterData, 'characterClass'> & {
  class: CharacterClass;
};

export type RawCharacterData = RawBaseCharacterData & {
  stats: CharacterStats;
};

export type AddCharacterPayload = Omit<BaseCharacterData, 'status' | 'id'>;

/**
 * For now. Gotta remove it when the character status is not pending or draft.
 */
export type UpdateCharacterPayload = Omit<
  BaseCharacterData,
  'characterClass' | 'race' | 'status'
>;
