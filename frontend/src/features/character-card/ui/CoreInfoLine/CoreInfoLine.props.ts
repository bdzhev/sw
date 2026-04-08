import type { BaseCharacterData } from '@shared/api/characters';

export interface CoreInfoLineProps {
  label: string;
  field: keyof Omit<BaseCharacterData, 'id'>;
}
