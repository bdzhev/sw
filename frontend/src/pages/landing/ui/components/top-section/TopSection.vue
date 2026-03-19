<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import { Button } from '@shared/ui/button';
import { Skeleton } from '@shared/ui/skeleton';

import { useUser } from '@entities/user';

import { useHeaderUiStore } from '@widgets/landing-header';

import { useTopSectionAnimation } from '../../../lib';

const store = useHeaderUiStore();

const { t } = useI18n();

const { isLoggedIn } = useUser();

useTopSectionAnimation();
</script>

<!-- prettier-ignore -->
<template>
  <section class="relative flex h-screen w-full justify-end px-22 pt-60">
    <div class="z-1 flex w-full flex-col gap-10">
      <article class="flex flex-col font-alegreya">
        <span
          class="
            invisible mb-2 text-9xl font-extrabold whitespace-nowrap
            text-branding italic
          "
          id="landingSlogan"
        >
          {{ t('Magic? Indeed.') }}
        </span>

        <span
          class="invisible text-5xl font-light whitespace-pre-line text-primary"
          id="landingSloganDescription1"
        >
          {{ t('You create the character.') }}
        </span>

        <span
          class="invisible text-5xl font-light whitespace-pre-line text-primary"
          id="landingSloganDescription2"
        >
          {{ t('We deal with the stats.') }}
        </span>
      </article>

      <RouterLink
        :to="isLoggedIn ? '/app' : '/signup'"
        @click="store.resetHasScrolled"
      >
        <Button size="lg">
          {{ isLoggedIn ? 'Go to account' : 'Start now' }}
        </Button>
      </RouterLink>
    </div>

    <div class="absolute top-20 h-160 w-[60%]">
      <Skeleton />
    </div>
  </section>
</template>
