import { computed, type ComputedRef } from 'vue';

import { CharacterStat } from '@shared/api/characters';

import { ABILITIES, withItemBonuses, type AbilityScores } from '@entities/characters';

import type { UseAbilityTotalsParams } from './useAbilityTotals.types';

/**
 * The six ability totals, narrowed so an unrelated sheet edit does not rebuild them.
 *
 * `sheet` gets a brand-new identity on every autosave patch, so a plain
 * `computed(() => totalAbilityScores(sheet.value, items.value))` re-walked the
 * inventory and returned a fresh object when a language was picked — and every
 * view model built on it churned with it. Reading each score through its own
 * `computed` fixes that: a computed only notifies when its own value changes, and
 * these six hold numbers.
 */
export const useAbilityTotals = ({
  sheet,
  items,
}: UseAbilityTotalsParams): ComputedRef<AbilityScores> => {
  const rawScores = ABILITIES.reduce(
    (map, ability) => {
      map[ability.stat] = computed((): number => {
        return sheet.value?.[ability.field] ?? 0;
      });

      return map;
    },
    {} as Record<CharacterStat, ComputedRef<number>>,
  );

  return computed((): AbilityScores => {
    const base = ABILITIES.reduce((scores, ability) => {
      scores[ability.stat] = rawScores[ability.stat].value;

      return scores;
    }, {} as AbilityScores);

    return withItemBonuses(base, items.value);
  });
};
