import type { characterRaceEnum } from '@/shared/db';

type CharacterRace = (typeof characterRaceEnum.enumValues)[number];

/**
 * The only rules table the backend owns a copy of, and only because the sheet
 * row is born at character create — before the quiz has produced any ability
 * scores, race is the one thing already known. Everything else class- or
 * level-derived lives in the frontend `class-tables` module; hp_max and ac
 * cannot be computed here at all and wait for the setup flow.
 *
 * Twin of the race table in `frontend/src/entities/characters` — change both.
 */
const SPEED_BY_RACE: Record<CharacterRace, number> = {
  human: 30,
  elf: 30,
  dwarf: 25,
  halfling: 25,
  gnome: 25,
  'half-orc': 30,
  tiefling: 30,
  dragonborn: 30,
  'half-elf': 30,
};

const DEFAULT_SPEED = 30;

export const speedForRace = (race: CharacterRace): number => {
  return SPEED_BY_RACE[race] ?? DEFAULT_SPEED;
};
