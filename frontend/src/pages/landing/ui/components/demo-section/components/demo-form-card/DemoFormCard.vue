<script setup lang="ts">
import { Card } from '@shared/ui/card';

import {
  DemoStatsForm,
  type DemoStatsFormValues,
} from '@widgets/demo-stats-form';

import { useDemoStatsStore } from '../../../../../model/useDemoStatsStore';

const { updateCharName, updateAllStats, resetAll, state } = useDemoStatsStore();

const handleFormSubmit = (values: DemoStatsFormValues) => {
  updateCharName(values.characterName);
  updateAllStats(values.stats);
};
</script>

<template>
  <Card variant="secondary" class="px-0 py-0">
    <DemoStatsForm
      :initial-values="state"
      :on-form-submit="handleFormSubmit"
      :on-form-reset="resetAll"
    />
  </Card>
</template>
