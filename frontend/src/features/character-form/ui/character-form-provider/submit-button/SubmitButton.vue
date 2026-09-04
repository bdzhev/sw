<script setup lang="ts">
import { inject } from 'vue';

import { Button } from '@shared/ui/button';

import { CHARACTER_FORM_CTX_KEY } from '../constants';
import type { SubmitButtonProps } from './SubmitButton.types';

const props = withDefaults(defineProps<SubmitButtonProps>(), {
  isLoading: false,
});

/** The only copy of the submit gate — a consumer passing it again drifts. */
const { meta } = inject(CHARACTER_FORM_CTX_KEY)!;
</script>

<template>
  <Button
    type="submit"
    :is-disabled="!meta.dirty || !meta.valid"
    :is-loading="props.isLoading"
    class="min-h-11 md:min-h-0"
  >
    <slot />
  </Button>
</template>
