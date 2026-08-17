<script setup lang="ts">
import { Label } from 'reka-ui';

import { FIELD_LABEL_CLASSES } from './constants';
import type { FieldLabelProps } from './FieldLabel.types';

const props = withDefaults(defineProps<FieldLabelProps>(), {
  isHidden: false,
});
</script>

<template>
  <Label :for="props.fieldId" :class="[FIELD_LABEL_CLASSES, props.isHidden && 'sr-only']">
    <slot />
  </Label>
</template>
