import type { CharacterIdentity } from '@shared/api/characters';

export interface UseSettingsFormOptions {
  /** undefined until the character query resolves. */
  getCharacter: () => CharacterIdentity | undefined;
}
