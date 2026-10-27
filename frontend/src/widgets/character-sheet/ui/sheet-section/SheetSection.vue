<script setup lang="ts">
import { computed, useSlots } from 'vue';

import { Text } from '@shared/ui/text';

import { headingTags, shellClasses } from './SheetSection.themes';
import type { SheetSectionProps } from './SheetSection.types';

const props = withDefaults(defineProps<SheetSectionProps>(), {
  variant: 'card',
  headingLevel: 2,
});

const slots = useSlots();

const shell = computed(() => {
  return shellClasses[props.variant];
});

const headingTag = computed(() => {
  return headingTags[props.headingLevel];
});

const hasHeadingRow = computed(() => {
  return Boolean(props.title) || Boolean(props.description) || Boolean(slots.actions);
});
</script>

<template>
  <section :class="['flex flex-col', shell]">
    <div v-if="hasHeadingRow" class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex min-w-0 flex-col gap-1">
        <component
          :is="headingTag"
          v-if="props.title"
          class="text-sm font-semibold text-primary uppercase"
        >
          {{ props.title }}
        </component>

        <Text v-if="props.description" size="xs" theme="secondary">
          {{ props.description }}
        </Text>
      </div>

      <slot name="actions" />
    </div>

    <slot />
  </section>
</template>
