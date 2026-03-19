<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useHorizontalScrollAnimation } from '@shared/lib/animations';
import { Card } from '@shared/ui/card';

import { HorizontalScrollSection } from './components';

useHorizontalScrollAnimation({
  wrapperSelector: '#horizontalWrapper',
  rowSelector: '#painSectionScroll',
  childrenSelector: '#painSectionScroll article',
});

const { t } = useI18n();
</script>

<!-- prettier-ignore -->
<template>
  <section
    id="horizontalWrapper"
    class="relative w-full overflow-hidden bg-primary-bg/70 backdrop-blur-3xl"
  >
    <div id="painSectionScroll" class="relative flex flex-nowrap">
      <span
        class="
          absolute top-0 z-10 mt-30 mb-8 translate-y-2 px-20 font-alegreya
          text-5xl font-extrabold text-primary italic
        "
        id="title"
      >
        {{ t('Character creation has always been a struggle...') }}
      </span>

      <HorizontalScrollSection>
        <Card class="h-full w-full" variant="outline" size="lg" :blur="false">
          You get invited to a cool new adventure
        </Card>
      </HorizontalScrollSection>

      <HorizontalScrollSection>
        <Card class="h-full w-full" variant="outline" size="lg" :blur="false">
          You think of the craziest bard or the most stoic barbarian ever
        </Card>
      </HorizontalScrollSection>

      <HorizontalScrollSection>
        <Card class="h-full w-full" variant="outline" size="lg" :blur="false">
          But, figuring how to beat the scariest dragons seems to be easier than
          to figure out the point distribution system
        </Card>
      </HorizontalScrollSection>
    </div>
  </section>
</template>
<!-- prettier-ignore -->
