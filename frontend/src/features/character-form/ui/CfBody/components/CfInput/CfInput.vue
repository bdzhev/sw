<script setup lang="ts">
import { Input } from '@shared/ui/input';

import type { CfInputProps } from './CfInput.props';

const props = defineProps<CfInputProps>();
</script>

<template>
  <Input :name="props.name" />
</template>
