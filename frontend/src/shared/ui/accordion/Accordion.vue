<script setup lang="ts">
import { AccordionRoot } from 'reka-ui';

import type { AccordionProps } from './Accordion.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AccordionProps>(), {
  type: 'single',
  isCollapsible: true,
});

/**
 * `string` for `single`, `string[]` for `multiple` — reka's own union, kept
 * rather than narrowed so both modes work through one wrapper.
 */
const model = defineModel<string | string[] | undefined>();
</script>

<template>
  <AccordionRoot
    v-bind="$attrs"
    v-model="model"
    :type="props.type"
    :collapsible="props.isCollapsible"
    class="flex w-full flex-col gap-2"
  >
    <slot />
  </AccordionRoot>
</template>
