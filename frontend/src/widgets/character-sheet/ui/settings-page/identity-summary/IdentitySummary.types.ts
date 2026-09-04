import type { CharacterClass, CharacterRace } from '@shared/api/characters';

export interface IdentitySummaryProps {
  race: CharacterRace;
  characterClass: CharacterClass;
  level: number;
}
