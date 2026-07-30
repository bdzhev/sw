import type { CharacterClass, CharacterRace } from '@shared/api/characters';

export interface CreateCharacterFormValues {
  name: string;
  class: CharacterClass;
  race: CharacterRace;
}
