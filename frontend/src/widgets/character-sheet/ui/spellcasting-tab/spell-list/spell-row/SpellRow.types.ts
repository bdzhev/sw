import type { CharacterSpell, SpellSlots } from '@shared/api/characters';

export interface SpellRowProps {
  spell: CharacterSpell;
  slots: SpellSlots;
  isSaving?: boolean;
}
