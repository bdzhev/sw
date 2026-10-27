<script setup lang="ts">
import { inject } from 'vue';

import { Button } from '@shared/ui/button';

import { CHARACTER_FORM_CTX_KEY } from '../constants';
import type { CancelButtonProps } from './CancelButton.types';

const props = withDefaults(defineProps<CancelButtonProps>(), {
  isLoading: false,
  isDisabled: false,
});

const emit = defineEmits<{ cancel: [] }>();

const form = inject(CHARACTER_FORM_CTX_KEY)!;

/** Resetting is this button's own job; closing the surface is the consumer's. */
const handleClick = (): void => {
  form.handleReset();

  emit('cancel');
};
</script>

<template>
  <Button
    variant="secondary"
    :is-loading="props.isLoading"
    :is-disabled="props.isDisabled"
    class="min-h-11 md:min-h-0"
    @click="handleClick"
  >
    <slot />
  </Button>
</template>
