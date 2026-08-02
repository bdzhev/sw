<script setup lang="ts">
import { Pin } from 'lucide-vue-next';
import { Label, SwitchRoot, SwitchThumb } from 'reka-ui';
import { useField } from 'vee-validate';

import type { PinFieldProps } from './PinField.types';

const props = withDefaults(defineProps<PinFieldProps>(), {
  label: 'Pin to quick reference',
});

const { value } = useField<boolean>(() => {
  return props.name;
});
</script>

<template>
  <div class="flex min-h-11 items-center justify-between gap-3">
    <Label :for="props.name" class="flex items-center gap-2 text-sm text-secondary">
      <Pin :size="16" />

      {{ props.label }}
    </Label>

    <SwitchRoot
      :id="props.name"
      v-model="value"
      class="relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full ring-2 transition-colors data-[state=checked]:bg-accent-secondary data-[state=checked]:ring-accent-primary/60 data-[state=unchecked]:bg-bg-raised data-[state=unchecked]:ring-primary/50"
    >
      <!-- transition-all, not transition-transform: v4's translate-* sets `translate`. -->
      <SwitchThumb
        class="block size-5 translate-x-0.5 rounded-full bg-primary transition-all duration-150 data-[state=checked]:translate-x-5"
      />
    </SwitchRoot>
  </div>
</template>
