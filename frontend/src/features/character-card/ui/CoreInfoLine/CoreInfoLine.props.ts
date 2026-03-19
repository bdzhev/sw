import type { CharacterData } from '@shared/api/characters';

export interface CoreInfoLineProps {
  label: string;
  field: keyof Omit<CharacterData, 'id' | 'stats'>;
}
