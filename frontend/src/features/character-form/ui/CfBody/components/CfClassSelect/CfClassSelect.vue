<script setup lang="ts">
import { Select } from '@shared/ui/select';

import { characterClassSelectItems } from '../../../../config';

import type { CfClassSelectProps } from './CfClassSelect.props';

const props = defineProps<CfClassSelectProps>();
</script>

<template>
  <Select
    :name="props.name"
    :options="characterClassSelectItems"
    class="mb-4"
  />
</template>
