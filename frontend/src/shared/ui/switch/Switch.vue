<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';
import { useId } from 'vue';

import { FieldLabel } from '@shared/ui/field-label';

import type { SwitchProps } from './Switch.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwitchProps>(), {
  isLabelHidden: false,
  isDisabled: false,
});

const checked = defineModel<boolean>({ default: false });

const switchId = useId();
</script>

<template>
  <div v-bind="$attrs" class="flex min-h-11 items-center justify-between gap-3">
    <FieldLabel
      :field-id="switchId"
      :is-hidden="props.isLabelHidden"
      class="flex cursor-pointer items-center gap-2"
    >
      <slot name="icon" />

      {{ props.label }}
    </FieldLabel>

    <SwitchRoot
      :id="switchId"
      v-model="checked"
      :disabled="props.isDisabled"
      class="relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full ring-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-secondary data-[state=checked]:ring-accent-primary/60 data-[state=unchecked]:bg-bg-raised data-[state=unchecked]:ring-primary/50"
    >
      <!-- transition-all, not transition-transform: v4's translate-* sets `translate`. -->
      <SwitchThumb
        class="block size-5 translate-x-0.5 rounded-full bg-primary transition-all duration-150 data-[state=checked]:translate-x-5"
      />
    </SwitchRoot>
  </div>
</template>
