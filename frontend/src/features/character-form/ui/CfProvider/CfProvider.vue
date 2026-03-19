<script lang="ts" setup>
import { provide } from 'vue';

import type { CfProviderProps } from './CfProvider.props';

const props = defineProps<CfProviderProps>();

provide('formContext', props.formContext);
</script>

<template>
  <form @submit.prevent="props.onSubmit">
    <slot />
  </form>
</template>
