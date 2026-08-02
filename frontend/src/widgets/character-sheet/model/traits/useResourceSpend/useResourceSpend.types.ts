import type { ClassResource } from '@shared/api/characters';

export interface UseResourceSpendOptions {
  getResource: () => ClassResource;
  isOpen: () => boolean;
  /** Always a positive number already clamped to the remaining pool. */
  onSpend: (amount: number) => void;
}
