<script setup lang="ts">
import { Select } from '@shared/ui/select';

import { characterRaceSelectItems } from '@features/character-form/config';

import type { RaceSelectProps } from './RaceSelect.types';

const props = defineProps<RaceSelectProps>();
</script>

<template>
  <Select
    :name="props.name"
    :options="characterRaceSelectItems"
    label="Race"
    placeholder="Pick a race"
  />
</template>
