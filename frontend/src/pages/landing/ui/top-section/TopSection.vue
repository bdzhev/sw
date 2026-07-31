<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';

import { useUser } from '@entities/user';

import { useHeaderUiStore } from '@widgets/landing-header';

import { useTopSectionAnimation } from '../../lib';

const store = useHeaderUiStore();

const { t } = useI18n();

const { isLoggedIn } = useUser();

useTopSectionAnimation();
</script>

<template>
  <section
    class="relative flex min-h-[100svh] w-full flex-col page-x pt-24 md:pt-48 lg:pt-60"
  >
    <div
      class="mb-6 h-48 w-full sm:h-64 md:absolute md:top-20 md:mb-0 md:h-160 md:w-[60%]"
    >
      <Skeleton />
    </div>

    <div class="z-1 flex w-full flex-col gap-6 md:gap-10">
      <article class="flex flex-col font-alegreya">
        <span
          id="landingSlogan"
          class="invisible mb-2 text-4xl font-extrabold text-branding italic sm:text-5xl md:text-6xl lg:text-9xl lg:whitespace-nowrap"
        >
          {{ t('Magic? Indeed.') }}
        </span>

        <span
          id="landingSloganDescription1"
          class="invisible text-2xl font-light whitespace-pre-line text-primary sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {{ t('You create the character.') }}
        </span>

        <span
          id="landingSloganDescription2"
          class="invisible text-2xl font-light whitespace-pre-line text-primary sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {{ t('We deal with the stats.') }}
        </span>
      </article>

      <RouterLink
        class="block w-full sm:w-fit"
        :to="isLoggedIn ? { name: RouteName.APP_HOME } : { name: RouteName.SIGNUP }"
        @click="store.resetHasScrolled"
      >
        <Button size="lg" width="fullOnMobile">
          {{ isLoggedIn ? 'Go to account' : 'Start now' }}
        </Button>
      </RouterLink>
    </div>
  </section>
</template>
