import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { CollectionKey, SpellcastingProgression } from '@shared/api/characters';
import type { SheetPatch } from '@shared/api/characters';

import {
  availableSlotLevels,
  resolveSpellcastingAbility,
  slotMaximaFromProgression,
  spellAttackBonus,
  spellSaveDc,
  useCharacter,
  useCharacterCollection,
  useSheetAutosave,
} from '@entities/characters';

import type { SpellBody } from '@widgets/character-sheet/config/spellcasting';

/**
 * The data half of the spellcasting tab. Dialog state stays in the component as
 * local refs — the rows here emit rather than reaching for a store, so there is
 * nothing for a singleton to hold.
 *
 * Slot counters and progression are autosaved; adding or deleting a spell is a
 * discrete explicit call. Those are two different channels on purpose.
 */
export const useSpellcastingTab = () => {
  const route = useRoute();

  const characterId = computed(() => {
    return route.params.id as string;
  });

  const { character } = useCharacter({ id: characterId.value });
  const autosave = useSheetAutosave();

  const spells = useCharacterCollection(CollectionKey.SPELLS, {
    characterId: characterId.value,
  });

  const sheet = computed(() => {
    return character.value?.sheet;
  });

  const items = computed(() => {
    return character.value?.inventoryItems ?? [];
  });

  const characterClass = computed(() => {
    return character.value?.character.characterClass ?? null;
  });

  const allSpells = computed(() => {
    return character.value?.spells ?? [];
  });

  const progression = computed(() => {
    return sheet.value?.spellcastingProgression ?? SpellcastingProgression.NONE;
  });

  const isPactMagic = computed(() => {
    return progression.value === SpellcastingProgression.PACT;
  });

  /** Falls back to INT for the two overridden non-casters — see `resolveSpellcastingAbility`. */
  const castingAbility = computed(() => {
    return characterClass.value
      ? resolveSpellcastingAbility(characterClass.value, progression.value)
      : null;
  });

  const saveDc = computed(() => {
    return sheet.value
      ? spellSaveDc(sheet.value, castingAbility.value, items.value)
      : null;
  });

  const attackBonus = computed(() => {
    return sheet.value
      ? spellAttackBonus(sheet.value, castingAbility.value, items.value)
      : null;
  });

  /** Levels the character actually has a pool at — the cast picker's shortlist. */
  const slotLevels = computed(() => {
    return sheet.value ? availableSlotLevels(sheet.value) : [];
  });

  /** What the rules would give them, for the one-tap fill. null = no table. */
  const tableMaxima = computed(() => {
    return sheet.value
      ? slotMaximaFromProgression(progression.value, sheet.value.level)
      : null;
  });

  /**
   * The ceiling on the standard search. Cantrips need no special case — level 0
   * is always `<= maxLevel`, even at 0 for a character with no slots at all.
   */
  const maxCastableLevel = computed(() => {
    return slotLevels.value.length > 0 ? Math.max(...slotLevels.value) : 0;
  });

  /**
   * Nothing in the schema stops the same reference spell being added twice, so
   * the search marks what is already on the list and disables its add button.
   */
  const addedSpellIds = computed(() => {
    return new Set(
      allSpells.value
        .map((spell) => {
          return spell.spellId;
        })
        .filter((spellId): spellId is string => {
          return spellId !== null;
        }),
    );
  });

  const isSavingSpell = computed(() => {
    return spells.isCreating.value || spells.isDeleting.value;
  });

  const patchSheet = (patch: SheetPatch, immediate = false) => {
    autosave.patchSheet(patch, immediate);
  };

  const addSpell = async (body: SpellBody): Promise<boolean> => {
    try {
      await spells.createRow(body);
    } catch {
      return false;
    }

    return true;
  };

  /**
   * Absolute value, never a delta, and the whole `spellSlots` object — the
   * autosave buffer merges by sheet field with no deep merge, so sending only
   * `current` would drop a `max` edit still sitting in it.
   *
   * Debounced rather than immediate: a slot counter is the self-healing
   * repeated-field case, where the next write resends the absolute value.
   */
  const castAtLevel = (slotLevel: number): void => {
    const slots = sheet.value?.spellSlots;

    if (!slots) return;

    const key = String(slotLevel);
    const next = Math.max(0, (slots.current[key] ?? 0) - 1);

    patchSheet({
      spellSlots: { ...slots, current: { ...slots.current, [key]: next } },
    });
  };

  const deleteSpell = async (rowId: string): Promise<boolean> => {
    try {
      await spells.deleteRow(rowId);
    } catch {
      return false;
    }

    return true;
  };

  return {
    character,
    sheet,
    characterClass,
    allSpells,
    progression,
    isPactMagic,
    castingAbility,
    saveDc,
    attackBonus,
    slotLevels,
    tableMaxima,
    maxCastableLevel,
    addedSpellIds,
    isSavingSpell,
    patchSheet,
    castAtLevel,
    addSpell,
    deleteSpell,
  };
};
