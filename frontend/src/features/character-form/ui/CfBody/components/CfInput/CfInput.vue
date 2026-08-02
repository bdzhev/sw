<script setup lang="ts">
import { FormInput } from '@shared/ui/form-input';

import type { CfInputProps } from './CfInput.props';

const props = defineProps<CfInputProps>();
</script>

<template>
  <FormInput :name="props.name" />
</template>
