<script setup lang="ts">
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import type { Languages, SkillProficiencies } from '@shared/api/characters';
import { DataTable } from '@shared/ui/data-table';
import { Skeleton } from '@shared/ui/skeleton';

import {
  abilityLabels,
  abilityShortLabels,
  passivePerception,
  proficiencyBonus,
  skillModifier,
  SKILLS,
} from '@entities/characters';

import {
  SKILL_ABILITY_ORDER,
  SKILL_COLUMNS,
} from '@widgets/character-sheet/config/skills';
import type {
  SkillGroupView,
  SkillProficiencyLevel,
  SkillRowView,
} from '@widgets/character-sheet/config/skills';
import { useAbilityTotals } from '@widgets/character-sheet/model/abilities';
import { useSheetContext } from '@widgets/character-sheet/model/sheet-shell';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { LanguagePicker } from './language-picker';
import { SkillGroup } from './skill-group';
import { SkillSummary } from './skill-summary';

const TABLE_CAPTION =
  'Skills grouped by governing ability. Each proficiency button cycles none, proficient, expertise.';

/** A stable fallback: a fresh `[]` per read would defeat the narrowing below. */
const EMPTY_LANGUAGES: string[] = [];

/** The modifier column's header follows its numbers to the right. */
const HEADER_CLASSES = { modifier: 'text-right' };

const { character, sheet, patchSheet } = useSheetContext();
/** The event handler; the seam itself is a method, so the component names this. */
const handlePatch = (patch: SheetPatch, immediate = false): void => {
  patchSheet(patch, immediate);
};

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

/**
 * The item scan, once for all eighteen skills plus passive perception. Each helper
 * used to redo it internally, so one hp edit walked the inventory nineteen times.
 */
const { totals } = useAbilityTotals({ sheet, items });

/**
 * The two other narrow reads the table is built from. Neither notifies on an
 * unrelated edit: `skillProficiencies` keeps its identity through vue-query's
 * structural sharing, and a bonus is a number.
 */
const proficiencies = computed(() => {
  return sheet.value?.skillProficiencies;
});

const bonus = computed(() => {
  return sheet.value ? proficiencyBonus(sheet.value) : 0;
});

/**
 * Reads only the narrowed values above — never `sheet` — so it holds its identity
 * across an edit that cannot change a skill, and every `SkillGroup` skips its
 * render with it.
 */
const groups = computed<SkillGroupView[]>(() => {
  const scores = totals.value;
  const levels = proficiencies.value;

  if (!levels) {
    return [];
  }

  return SKILL_ABILITY_ORDER.map((ability) => {
    return {
      ability,
      label: abilityLabels[ability],
      skills: SKILLS.filter((skill) => {
        return skill.ability === ability;
      }).map((skill) => {
        return {
          key: skill.key,
          label: skill.label,
          abilityLabel: abilityShortLabels[skill.ability],
          modifier: skillModifier(
            scores,
            skill.ability,
            levels[skill.key] ?? 0,
            bonus.value,
          ),
          proficiency: (levels[skill.key] ?? 0) as SkillProficiencyLevel,
        };
      }),
    };
  });
});

/**
 * The table's row model. The body is still rendered per governing ability by
 * `SkillGroup`, so this is what drives the header and the row count, not the
 * markup order.
 */
const skillRows = computed<SkillRowView[]>(() => {
  return groups.value.flatMap((group) => {
    return group.skills;
  });
});

const passive = computed(() => {
  const current = sheet.value;

  return current ? passivePerception(totals.value, current) : 0;
});

/**
 * Narrowed the same way: the normalising literal is a new object every time, so
 * reading `sheet` for it re-rendered the picker on every unrelated edit. The
 * stored array keeps its identity through structural sharing, and `other` is a
 * string, so neither read notifies unless a language actually changed.
 */
const standardLanguages = computed(() => {
  return sheet.value?.languages?.standard ?? EMPTY_LANGUAGES;
});

const otherLanguages = computed(() => {
  return sheet.value?.languages?.other ?? '';
});

const languages = computed<Languages>(() => {
  return { standard: standardLanguages.value, other: otherLanguages.value };
});

/** none → proficient → expertise → none. Absent means neither, never a stored 0. */
const handleCycleProficiency = (skillKey: string) => {
  const current = sheet.value;

  if (!current) {
    return;
  }

  const next: SkillProficiencies = { ...current.skillProficiencies };
  const level = next[skillKey] ?? 0;

  if (level === 0) {
    next[skillKey] = 1;
  } else if (level === 1) {
    next[skillKey] = 2;
  } else {
    delete next[skillKey];
  }

  handlePatch({ skillProficiencies: next }, true);
};

const handleUpdateLanguages = (value: Languages, immediate = false) => {
  handlePatch({ languages: value }, immediate);
};
</script>

<template>
  <section class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <template v-if="!sheet">
      <!-- Skeleton hardcodes `h-full w-full`, so its size has to come from a wrapper. -->
      <div class="h-24 w-full">
        <Skeleton class="rounded-lg" />
      </div>

      <div class="h-96 w-full">
        <Skeleton class="rounded-lg" />
      </div>
    </template>

    <template v-else>
      <SheetSection title="Skills">
        <DataTable
          :columns="SKILL_COLUMNS"
          :data="skillRows"
          :caption="TABLE_CAPTION"
          :header-classes="HEADER_CLASSES"
        >
          <SkillGroup
            v-for="group in groups"
            :key="group.ability"
            :group="group"
            @cycle="handleCycleProficiency"
          />
        </DataTable>
      </SheetSection>

      <SkillSummary
        :passive-perception="passive"
        :proficiency-bonus="proficiencyBonus(sheet)"
      />

      <LanguagePicker :languages="languages" @update="handleUpdateLanguages" />
    </template>
  </section>
</template>
