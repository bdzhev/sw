<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

import { useScrollSmoother } from '@shared/lib/animations';

import {
  TopSection,
  DemoSection,
  PainSection,
  AboutSection,
} from './components';

useScrollSmoother({
  wrapperSelector: '#layout',
  contentSelector: '#content',
});

/**
 * Footer is only required on the landing page, so unfortunately
 * it will be placed in main, which is not semantically accurate.
 */
const FancyBackground = defineAsyncComponent({
  loader: async () => {
    const { FancyBackground } = await import('./components');

    return FancyBackground;
  },
  timeout: 1000,
});
</script>

<template>
  <TopSection />

  <PainSection />

  <DemoSection />

  <AboutSection />

  <transition
    enter-active-class="transition-opacity duration-1000"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <Teleport to="body">
      <FancyBackground />
    </Teleport>
  </transition>
</template>
