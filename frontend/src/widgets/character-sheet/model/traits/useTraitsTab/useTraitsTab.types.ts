import type { ComputedRef, Ref } from 'vue';

import type { ClassResource, Trait } from '@shared/api/characters';

import type { DetailPayload } from '@widgets/character-sheet/config/detail';

import type { ResourceSubmitValues } from '../useResourceForm';
import type { TraitSubmitValues } from '../useTraitForm';
import type { PendingDelete } from '../useTraitsUi';

/**
 * Written down rather than inferred, because the width is the point: twenty-one
 * members is what "the data half of a tab" costs, and the only way to notice
 * that is to have to type it out. Grouped by what each half is for.
 */
export interface UseTraitsTab {
  /** Rows — the complete lists, plus the pinned subsets in pin order. */
  allTraits: ComputedRef<Trait[]>;
  allResources: ComputedRef<ClassResource[]>;
  pinnedTraits: ComputedRef<Trait[]>;
  pinnedResources: ComputedRef<ClassResource[]>;

  /** Write state, per collection. */
  isSavingTrait: ComputedRef<boolean>;
  isSavingResource: ComputedRef<boolean>;

  /**
   * Dialog state, re-exported from `useTraitsUi` via `storeToRefs`. The rows
   * also reach the store directly, so this travels two routes at once — see the
   * note in `useTraitsUi`.
   */
  isTraitDialogOpen: Ref<boolean>;
  editedTrait: Ref<Trait | null>;
  isResourceDialogOpen: Ref<boolean>;
  editedResource: Ref<ClassResource | null>;
  isDetailOpen: Ref<boolean>;
  detail: Ref<DetailPayload>;
  isDeleteOpen: Ref<boolean>;
  pendingDelete: Ref<PendingDelete>;

  /** Writes. Each closes its own dialog on success and returns on failure. */
  submitTrait: (values: TraitSubmitValues) => Promise<void>;
  submitResource: (values: ResourceSubmitValues) => Promise<void>;
  confirmDelete: () => Promise<void>;
  toggleTraitPin: (trait: Trait) => void;
  toggleResourcePin: (resource: ClassResource) => void;
  spendResource: (resource: ClassResource, amount: number) => void;
}
