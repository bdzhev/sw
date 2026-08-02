<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { Languages, SkillProficiencies } from '@shared/api/characters';
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

import { SKILL_ABILITY_ORDER } from '@widgets/character-sheet/config/skills/constants';
import type {
  SkillGroupView,
  SkillProficiencyLevel,
} from '@widgets/character-sheet/config/skills/types';

import { LanguagePicker } from './language-picker';
import { SkillGroup } from './skill-group';
import { SkillSummary } from './skill-summary';

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

const languages = computed<Languages>(() => {
  return {
    standard: sheet.value?.languages?.standard ?? [],
    other: sheet.value?.languages?.other ?? '',
  };
});

/** none → proficient → expertise → none. Absent means neither, never a stored 0. */
const cycleProficiency = (skillKey: string) => {
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

const updateLanguages = (value: Languages, immediate = false) => {
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

      <div class="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table class="w-full min-w-max text-left">
          <caption class="sr-only">
            Skills grouped by governing ability. Each proficiency button cycles none,
            proficient, expertise.
          </caption>

          <thead>
            <tr class="border-b border-border">
              <th scope="col" class="px-2 py-2 text-xs text-secondary uppercase">
                Skill
              </th>
              <th scope="col" class="px-2 py-2 text-xs text-secondary uppercase">
                Ability
              </th>
              <th scope="col" class="px-2 py-2 text-xs text-secondary uppercase">Prof</th>
              <th
                scope="col"
                class="px-2 py-2 text-right text-xs text-secondary uppercase"
              >
                Mod
              </th>
            </tr>
          </thead>

          <SkillGroup
            v-for="group in groups"
            :key="group.ability"
            :group="group"
            @cycle="cycleProficiency"
          />
        </table>
      </div>

      <LanguagePicker :languages="languages" @update="updateLanguages" />
    </template>
  </section>
</template>
