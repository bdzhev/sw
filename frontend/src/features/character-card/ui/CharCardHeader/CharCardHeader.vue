<script setup lang="ts">
import { inject } from 'vue';

import type { CharCardContext } from '../CharCardRoot.types';

const ctx = inject<CharCardContext>('charCardCtx');
</script>

<template>
  <header class="w-full bg-accent-secondary/50 p-4 md:px-6">
    <!-- truncate keeps the card a fixed height — a wrapping name breaks the
         dashboard's fixed-pitch virtual rows. -->
    <h3 class="truncate text-branding">
      {{ ctx?.name }}
    </h3>
    <slot />
  </header>
</template>
