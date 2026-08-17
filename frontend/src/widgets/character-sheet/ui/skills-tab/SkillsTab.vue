<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { Languages, SkillProficiencies } from '@shared/api/characters';
import { DataTable } from '@shared/ui/data-table';
import { Skeleton } from '@shared/ui/skeleton';

import {
  ABILITY_LABELS,
  ABILITY_SHORT_LABELS,
  passivePerception,
  proficiencyBonus,
  skillTotal,
  SKILLS,
  useCharacter,
  useSheetAutosave,
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
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { LanguagePicker } from './language-picker';
import { SkillGroup } from './skill-group';
import { SkillSummary } from './skill-summary';

const TABLE_CAPTION =
  'Skills grouped by governing ability. Each proficiency button cycles none, proficient, expertise.';

/** The modifier column's header follows its numbers to the right. */
const HEADER_CLASSES = { modifier: 'text-right' };

const route = useRoute();
const id = route.params.id as string;

const { character } = useCharacter({ id });
const autosave = useSheetAutosave();

const sheet = computed(() => {
  return character.value?.sheet;
});

const items = computed(() => {
  return character.value?.inventoryItems ?? [];
});

const groups = computed<SkillGroupView[]>(() => {
  const current = sheet.value;

  if (!current) return [];

  return SKILL_ABILITY_ORDER.map((ability) => {
    return {
      ability,
      label: ABILITY_LABELS[ability],
      skills: SKILLS.filter((skill) => {
        return skill.ability === ability;
      }).map((skill) => {
        return {
          key: skill.key,
          label: skill.label,
          abilityLabel: ABILITY_SHORT_LABELS[skill.ability],
          modifier: skillTotal(current, skill.key, items.value),
          proficiency: (current.skillProficiencies[skill.key] ??
            0) as SkillProficiencyLevel,
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

const languages = computed<Languages>(() => {
  return {
    standard: sheet.value?.languages?.standard ?? [],
    other: sheet.value?.languages?.other ?? '',
  };
});

/** none → proficient → expertise → none. Absent means neither, never a stored 0. */
const handleCycleProficiency = (skillKey: string) => {
  const current = sheet.value;

  if (!current) return;

  const next: SkillProficiencies = { ...current.skillProficiencies };
  const level = next[skillKey] ?? 0;

  if (level === 0) {
    next[skillKey] = 1;
  } else if (level === 1) {
    next[skillKey] = 2;
  } else {
    delete next[skillKey];
  }

  autosave.patchSheet({ skillProficiencies: next }, true);
};

const handleUpdateLanguages = (value: Languages, immediate = false) => {
  autosave.patchSheet({ languages: value }, immediate);
};
</script>

<template>
  <section class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <template v-if="!sheet">
      <Skeleton class="h-24 w-full rounded-lg" />
      <Skeleton class="h-96 w-full rounded-lg" />
    </template>

    <template v-else>
      <SkillSummary
        :passive-perception="passivePerception(sheet, items)"
        :proficiency-bonus="proficiencyBonus(sheet)"
      />

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

      <LanguagePicker :languages="languages" @update="handleUpdateLanguages" />
    </template>
  </section>
</template>
