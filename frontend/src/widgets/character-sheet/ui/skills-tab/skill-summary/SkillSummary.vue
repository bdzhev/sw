<script setup lang="ts">
import { Text } from '@shared/ui/text';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { SkillSummaryProps } from './SkillSummary.types';

const props = defineProps<SkillSummaryProps>();
</script>

<template>
  <SheetSection>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div class="flex min-w-0 flex-col gap-1">
        <Text size="xs" theme="secondary" class="tracking-wide uppercase">
          Passive perception
        </Text>

        <p class="text-2xl leading-none font-semibold text-primary tabular-nums">
          {{ props.passivePerception }}
        </p>

        <Text size="xs" theme="secondary">10 + perception modifier</Text>
      </div>

      <div class="h-px w-full bg-border sm:h-12 sm:w-px"></div>

      <div class="flex min-w-0 flex-col gap-1">
        <Text size="xs" theme="secondary" class="tracking-wide uppercase">
          Proficiency bonus
        </Text>

        <p class="text-2xl leading-none font-semibold text-primary tabular-nums">
          +{{ props.proficiencyBonus }}
        </p>

        <Text size="xs" theme="secondary">from level</Text>
      </div>
    </div>
  </SheetSection>
</template>
