<script setup lang="ts">
import { Select } from '@shared/ui/select';

import { characterClassSelectItems } from '@features/character-form/config';

import type { ClassSelectProps } from './ClassSelect.types';

const props = defineProps<ClassSelectProps>();
</script>

<template>
  <Select
    :name="props.name"
    :options="characterClassSelectItems"
    label="Class"
    placeholder="Pick a class"
  />
</template>
