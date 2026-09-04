import { CharacterStat, type InventoryItem } from '@shared/api/characters';

import { ABILITY_SHORT_LABELS } from '@entities/characters';

import { formatSigned } from '@widgets/character-sheet/lib/format';

/** `"1 / 2 uses"`, or null when the item tracks none — then it is a reference card. */
export const usesPool = (item: InventoryItem): string | null => {
  if (item.maxUses === null) {
    return null;
  }

  return `${item.usesRemaining ?? 0} / ${item.maxUses} uses`;
};

/**
 * `"STR +2 · CON +1"`, or null when the item grants nothing. Ordered by the
 * ability list rather than by object key order, so two items with the same
 * bonuses always read the same way.
 */
export const modifierSummary = (item: InventoryItem): string | null => {
  const parts = Object.values(CharacterStat)
    .filter((stat) => {
      return Boolean(item.statModifiers[stat]);
    })
    .map((stat) => {
      return `${ABILITY_SHORT_LABELS[stat]} ${formatSigned(item.statModifiers[stat] ?? 0)}`;
    });

  return parts.length > 0 ? parts.join(' · ') : null;
};

export const hasStatModifiers = (item: InventoryItem): boolean => {
  return modifierSummary(item) !== null;
};
