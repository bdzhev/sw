<script setup lang="ts">
import type { FormContext } from 'vee-validate';
import { inject } from 'vue';

import { Button } from '@shared/ui/button';

import type { CfFooterCancelButtonProps } from './CfFooterCancelButton.props';

const props = defineProps<CfFooterCancelButtonProps>();

const form = inject<FormContext>('formContext')!;

const handleClick = () => {
  form.handleReset();
  props.onCancelClick?.();
};
</script>

<template>
  <Button variant="secondary" @click="handleClick">
    <slot />
  </Button>
</template>
