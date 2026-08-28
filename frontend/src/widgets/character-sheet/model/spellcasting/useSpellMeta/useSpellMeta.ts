import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import type { CharacterSpell } from '@shared/api/characters';

import {
  spellComponentsLabel,
  spellLevelLabel,
  spellMetaLine,
} from '@widgets/character-sheet/lib/spellcasting';

/**
 * Everything the row, the detail dialog and the search result ask of one spell.
 * A custom entry answers the same questions with fewer of them filled in, which
 * is the whole reason this is one place rather than three `v-if`s.
 */
export const useSpellMeta = (source: MaybeRefOrGetter<CharacterSpell>) => {
  const entry = computed(() => {
    return toValue(source);
  });

  const reference = computed(() => {
    return entry.value.spell;
  });

  const name = computed(() => {
    return reference.value?.name ?? entry.value.customName ?? 'Unnamed spell';
  });

  /** A custom entry carries its own; a reference spell's comes off the join. */
  const level = computed(() => {
    return reference.value?.level ?? entry.value.customLevel;
  });

  const levelLabel = computed(() => {
    return level.value === null ? null : spellLevelLabel(level.value);
  });

  const school = computed(() => {
    return reference.value?.school ?? null;
  });

  const isConcentration = computed(() => {
    return reference.value?.concentration ?? false;
  });

  const isRitual = computed(() => {
    return reference.value?.ritual ?? false;
  });

  const description = computed(() => {
    return reference.value?.description ?? entry.value.customDescription;
  });

  const higherLevel = computed(() => {
    return reference.value?.higherLevel ?? null;
  });

  const castingTime = computed(() => {
    return reference.value?.castingTime ?? null;
  });

  const rangeText = computed(() => {
    return reference.value?.rangeText ?? null;
  });

  const duration = computed(() => {
    return reference.value?.duration ?? null;
  });

  const components = computed(() => {
    return reference.value ? spellComponentsLabel(reference.value.components) : null;
  });

  /** A custom entry has nothing but a name, so its line reads "Custom" alone. */
  const metaLine = computed(() => {
    return spellMetaLine([
      levelLabel.value,
      school.value,
      isConcentration.value && 'Concentration',
      isRitual.value && 'Ritual',
      entry.value.isCustom && 'Custom',
    ]);
  });

  /**
   * A cantrip spends nothing, and a custom entry saved before levels existed has
   * no level to spend against — neither gets a cast button.
   */
  const isCastable = computed(() => {
    return level.value !== null && level.value > 0;
  });

  return {
    name,
    level,
    isCastable,
    levelLabel,
    school,
    isConcentration,
    isRitual,
    description,
    higherLevel,
    castingTime,
    rangeText,
    duration,
    components,
    metaLine,
  };
};
