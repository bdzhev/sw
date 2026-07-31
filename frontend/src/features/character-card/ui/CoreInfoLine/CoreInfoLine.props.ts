import type { CharacterSummary } from '@shared/api/characters';

export interface CoreInfoLineProps {
  label: string;
  field: keyof Omit<CharacterSummary, 'id'>;
}
