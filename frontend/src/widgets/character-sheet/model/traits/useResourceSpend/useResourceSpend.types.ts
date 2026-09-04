import type { ComputedRef, Ref } from 'vue';

import type { ClassResource } from '@shared/api/characters';

import type { ResourceSubAbility } from '@widgets/character-sheet/config/traits';

export interface UseResourceSpendOptions {
  getResource: () => ClassResource;
  isOpen: () => boolean;
  /** Always a positive number already clamped to the remaining pool. */
  onSpend: (amount: number) => void;
}

/**
 * Named member by member rather than spreading `useResourceMeta`, so a reader
 * can see where each one comes from — and so the three the dialog never reads
 * (`pool`, `resetLabel`, `isMaxUnknown`) stop being part of the surface.
 */
export interface UseResourceSpend {
  /** Re-exported from `useResourceMeta`: what the dialog needs to describe the pool. */
  label: ComputedRef<string>;
  remaining: ComputedRef<number>;
  subAbilities: ComputedRef<ResourceSubAbility[]>;
  hasSubAbilities: ComputedRef<boolean>;
  isExhausted: ComputedRef<boolean>;
  isUntracked: ComputedRef<boolean>;

  /** The amount field stands in for a variable-cost ability when one is picked. */
  amountLabel: ComputedRef<string>;
  selectedAbilityName: Ref<string | null>;

  selectAbility: (ability: ResourceSubAbility) => void;
  isAbilityDisabled: (ability: ResourceSubAbility) => boolean;
  /** Clamped and floored before it reaches `onSpend`. */
  spend: (cost: number) => void;
  handleSubmit: (event?: Event) => void;
}
