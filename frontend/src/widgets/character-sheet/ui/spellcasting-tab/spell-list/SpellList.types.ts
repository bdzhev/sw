import type { CharacterSpell, SpellSlots } from '@shared/api/characters';

export interface SpellListProps {
  spells: CharacterSpell[];
  slots: SpellSlots;
  isSaving?: boolean;
}
