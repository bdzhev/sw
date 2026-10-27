<script setup lang="ts">
import { FormSelect } from '@shared/ui/form-select';

import { characterRaceSelectItems } from '@features/character-form/config';

import type { RaceSelectProps } from './RaceSelect.types';

const props = defineProps<RaceSelectProps>();
</script>

<template>
  <FormSelect
    :name="props.name"
    :options="characterRaceSelectItems"
    label="Race"
    placeholder="Pick a race"
  />
</template>
