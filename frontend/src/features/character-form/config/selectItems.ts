import { CharacterClass, CharacterRace } from '@shared/api/characters';

export const characterClassSelectItems: {
  value: CharacterClass;
  label: string;
}[] = [
  { value: CharacterClass.BARBARIAN, label: 'Barbarian' },
  { value: CharacterClass.BARD, label: 'Bard' },
  { value: CharacterClass.CLERIC, label: 'Cleric' },
  { value: CharacterClass.DRUID, label: 'Druid' },
  { value: CharacterClass.FIGHTER, label: 'Fighter' },
  { value: CharacterClass.MONK, label: 'Monk' },
  { value: CharacterClass.PALADIN, label: 'Paladin' },
  { value: CharacterClass.RANGER, label: 'Ranger' },
  { value: CharacterClass.ROGUE, label: 'Rogue' },
  { value: CharacterClass.SORCERER, label: 'Sorcerer' },
  { value: CharacterClass.WARLOCK, label: 'Warlock' },
  { value: CharacterClass.WIZARD, label: 'Wizard' },
];

export const characterRaceSelectItems: {
  value: CharacterRace;
  label: string;
}[] = [
  { value: CharacterRace.HUMAN, label: 'Human' },
  { value: CharacterRace.ELF, label: 'Elf' },
  { value: CharacterRace.DWARF, label: 'Dwarf' },
  { value: CharacterRace.HALFLING, label: 'Halfling' },
  { value: CharacterRace.GNOME, label: 'Gnome' },
  { value: CharacterRace.HALF_ORC, label: 'Half-orc' },
  { value: CharacterRace.TIEFLING, label: 'Tiefling' },
  { value: CharacterRace.DRAGONBORN, label: 'Dragonborn' },
  { value: CharacterRace.HALF_ELF, label: 'Half-elf' },
];
