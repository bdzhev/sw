<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem as AccordionItemPrimitive,
  AccordionTrigger,
} from 'reka-ui';
import { computed } from 'vue';

import {
  contentClasses,
  headerClasses,
  surfaceClasses,
  triggerClasses,
} from './AccordionItem.themes';
import type { AccordionItemProps } from './AccordionItem.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AccordionItemProps>(), { variant: 'card' });

const surface = computed(() => {
  return surfaceClasses[props.variant];
});

const header = computed(() => {
  return headerClasses[props.variant];
});

const trigger = computed(() => {
  return triggerClasses[props.variant];
});

const content = computed(() => {
  return contentClasses[props.variant];
});
</script>

<template>
  <AccordionItemPrimitive v-bind="$attrs" :value="props.value" :class="surface">
    <AccordionHeader :class="['flex items-center gap-2', header]">
      <AccordionTrigger
        :class="[
          'group flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 text-left transition-colors hover:text-primary',
          trigger,
        ]"
      >
        <slot name="trigger" />

        <ChevronDown
          :size="16"
          class="ml-auto shrink-0 text-secondary transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </AccordionTrigger>

      <!-- Outside the trigger on purpose: an action in here would toggle the panel. -->
      <slot name="actions" />
    </AccordionHeader>

    <AccordionContent
      class="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none"
    >
      <div :class="content">
        <slot />
      </div>
    </AccordionContent>
  </AccordionItemPrimitive>
</template>
