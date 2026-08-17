<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useHorizontalScrollAnimation } from '@shared/lib/animations';
import { Card } from '@shared/ui/card';

import { HorizontalScrollSection } from './horizontal-scroll-section';

/**
 * Defaults to md and up. Below that the panels below are a plain vertical stack
 * and no pinning happens at all — see the composable for why.
 */
useHorizontalScrollAnimation({
  wrapperSelector: '#horizontalWrapper',
  childrenSelector: '#painSectionScroll article',
});

const { t } = useI18n();
</script>

<template>
  <section
    id="horizontalWrapper"
    class="relative w-full overflow-hidden bg-bg-primary/70 pb-16 backdrop-blur-3xl md:pb-0"
  >
    <div id="painSectionScroll" class="relative flex flex-col md:flex-row md:flex-nowrap">
      <span
        id="title"
        class="relative z-10 mt-20 mb-8 page-x font-alegreya text-xl font-extrabold text-primary italic md:absolute md:top-0 md:mt-30 md:translate-y-2 md:text-2xl lg:text-5xl"
      >
        {{ t('Character creation has always been a struggle...') }}
      </span>

      <HorizontalScrollSection>
        <Card class="h-full w-full p-6 md:p-10" variant="outline" size="lg" :blur="false">
          {{ t('You get invited to a cool new adventure') }}
        </Card>
      </HorizontalScrollSection>

      <HorizontalScrollSection>
        <Card class="h-full w-full p-6 md:p-10" variant="outline" size="lg" :blur="false">
          You think of the craziest bard or the most stoic barbarian ever
        </Card>
      </HorizontalScrollSection>

      <HorizontalScrollSection>
        <Card class="h-full w-full p-6 md:p-10" variant="outline" size="lg" :blur="false">
          But, figuring how to beat the scariest dragons seems to be easier than to figure
          out the point distribution system
        </Card>
      </HorizontalScrollSection>
    </div>
  </section>
</template>
