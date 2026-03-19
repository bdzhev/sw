<script setup lang="ts">
import { inject } from 'vue';

import type { CharCardContext } from '../CharCardRoot.types';

const ctx = inject<CharCardContext>('charCardCtx');
</script>

<template>
  <header class="w-full bg-accent-secondary/50 p-4 px-6">
    <h3 class="text-branding">
      {{ ctx?.name }}
    </h3>
    <slot />
  </header>
</template>
