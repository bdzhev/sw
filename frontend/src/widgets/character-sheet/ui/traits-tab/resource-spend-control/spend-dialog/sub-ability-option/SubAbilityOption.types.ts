import type { ResourceSubAbility } from '@widgets/character-sheet/config/traits';

export interface SubAbilityOptionProps {
  ability: ResourceSubAbility;
  /** Highlighted while its variable cost is being typed into the amount field. */
  isSelected?: boolean;
  isDisabled?: boolean;
}
