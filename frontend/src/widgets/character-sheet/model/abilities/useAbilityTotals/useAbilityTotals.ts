import { computed, type ComputedRef } from 'vue';

import { CharacterStat } from '@shared/api/characters';

import { ABILITIES, withItemBonuses, type AbilityScores } from '@entities/characters';

import type { UseAbilityTotals, UseAbilityTotalsParams } from './useAbilityTotals.types';

/**
 * The ability scores, narrowed so an unrelated sheet edit does not rebuild them.
 *
 * `sheet` gets a brand-new identity on every autosave patch, so a plain
 * `computed(() => totalAbilityScores(sheet.value, items.value))` re-walked the
 * inventory and returned a fresh object when a language was picked — and every
 * view model built on it churned with it. Reading each score through its own
 * `computed` fixes that: a computed only notifies when its own value changes,
 * and these six hold numbers.
 *
 * **This is the one place the item list is scanned.** Consumers take the result
 * plus whatever else they name; none of them takes the sheet row to re-derive it.
 */
export const useAbilityTotals = ({
  sheet,
  items,
}: UseAbilityTotalsParams): UseAbilityTotals => {
  const perField = ABILITIES.reduce(
    (map, ability) => {
      map[ability.stat] = computed((): number => {
        return sheet.value?.[ability.field] ?? 0;
      });

      return map;
    },
    {} as Record<CharacterStat, ComputedRef<number>>,
  );

  const rawScores = computed((): AbilityScores => {
    return ABILITIES.reduce((scores, ability) => {
      scores[ability.stat] = perField[ability.stat].value;

      return scores;
    }, {} as AbilityScores);
  });

  const totals = computed((): AbilityScores => {
    return withItemBonuses(rawScores.value, items.value);
  });

  return { rawScores, totals };
};
