<script setup lang="ts">
import type { FormContext } from 'vee-validate';
import { inject } from 'vue';

import { Button } from '@shared/ui/button';

const ctx = inject<FormContext>('formContext')!;

const { meta } = ctx;
</script>

<template>
  <Button type="submit" :is-disabled="!meta.dirty || !meta.valid">
    <slot />
  </Button>
</template>
