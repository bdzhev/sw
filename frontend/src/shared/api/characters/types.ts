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

export interface CharacterData {
  id: string;
  name: string;
  characterClass: CharacterClass;
  race: CharacterRace;
  status: CharacterStatus;
  stats: Record<CharacterStat, number> | null;
}

export type AddCharacterPayload = {
  name: string;
  characterClass: CharacterClass;
  race: CharacterRace;
};

export type UpdateCharacterPayload = {
  id: string;
  name?: string;
};
