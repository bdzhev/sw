import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import type { ClassResource } from '@shared/api/characters';

import {
  KNOWN_RESOURCE_LABELS,
  RESET_TRIGGER_LABELS,
  RESOURCE_SUB_ABILITIES,
  type ResourceSubAbility,
} from '@widgets/character-sheet/config/traits';

/**
 * Everything the row, the use control and the use dialog all need to know about
 * one resource. Three components asked the same four questions of the same row,
 * so the questions live here once.
 */
export const useResourceMeta = (source: MaybeRefOrGetter<ClassResource>) => {
  const resource = computed(() => {
    return toValue(source);
  });

  const label = computed(() => {
    return (
      KNOWN_RESOURCE_LABELS[resource.value.resourceKey] ?? resource.value.resourceKey
    );
  });

  /**
   * A known resource's max is blank rather than derived: the per-class per-level
   * table it should come from was never transcribed from the SRD, so there is no
   * honest number to show. The player fills it in from the edit form.
   */
  const isMaxUnknown = computed(() => {
    return resource.value.maxValue === null;
  });

  const remaining = computed(() => {
    return Math.max(0, resource.value.current);
  });

  const pool = computed(() => {
    return `${resource.value.current} / ${isMaxUnknown.value ? '?' : resource.value.maxValue}`;
  });

  const resetLabel = computed(() => {
    return RESET_TRIGGER_LABELS[resource.value.resetTrigger];
  });

  const subAbilities = computed<ResourceSubAbility[]>(() => {
    return RESOURCE_SUB_ABILITIES[resource.value.resourceKey] ?? [];
  });

  const hasSubAbilities = computed(() => {
    return subAbilities.value.length > 0;
  });

  const isExhausted = computed(() => {
    return remaining.value <= 0;
  });

  /** No pool to spend from until a max is entered. */
  const isUntracked = computed(() => {
    return isMaxUnknown.value && resource.value.current === 0;
  });

  return {
    label,
    pool,
    resetLabel,
    remaining,
    isMaxUnknown,
    subAbilities,
    hasSubAbilities,
    isExhausted,
    isUntracked,
  };
};
