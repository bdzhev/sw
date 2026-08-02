<script setup lang="ts">
import type { AttackFieldProps } from './AttackField.types';

const props = defineProps<AttackFieldProps>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <span class="text-xs text-secondary uppercase">{{ props.label }}</span>

    <slot />
  </div>
</template>
