<script setup lang="ts">
import { Select } from '@shared/ui/select';

import { characterRaceSelectItems } from '../../../../config';

import type { CfRaceSelectProps } from './CfRaceSelect.props';

const props = defineProps<CfRaceSelectProps>();
</script>

<template>
  <Select :name="props.name" :options="characterRaceSelectItems" />
</template>
