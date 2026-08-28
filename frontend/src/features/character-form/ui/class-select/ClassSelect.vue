<script setup lang="ts">
import { FormSelect } from '@shared/ui/form-select';

import { characterClassSelectItems } from '@features/character-form/config';

import type { ClassSelectProps } from './ClassSelect.types';

const props = defineProps<ClassSelectProps>();
</script>

<template>
  <FormSelect
    :name="props.name"
    :options="characterClassSelectItems"
    label="Class"
    placeholder="Pick a class"
  />
</template>
