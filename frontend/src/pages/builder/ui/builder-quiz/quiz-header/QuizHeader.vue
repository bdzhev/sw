<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { RouteName } from '@shared/lib/router';
import { BackButton } from '@shared/ui/back-button';
import { Progress } from '@shared/ui/progress';

import { QuizProgress } from './quiz-progress';
import type { QuizHeaderProps } from './QuizHeader.types';

const props = defineProps<QuizHeaderProps>();

const { t } = useI18n();

/** The quiz has no app chrome, so this is the page's only way out. */
const charactersLink = computed(() => {
  return { name: RouteName.APP_HOME };
});
</script>

<template>
  <header class="shrink-0">
    <div class="flex items-center gap-2 page-x py-3 md:py-4">
      <!-- Equal `flex-1` sides are what centre the progress on the header itself
           rather than in the gap left over by the two controls. -->
      <div class="flex min-w-0 flex-1 justify-start">
        <BackButton
          :to="charactersLink"
          :label="t('Back to your characters')"
          class="-ml-1"
        />
      </div>

      <QuizProgress
        v-if="props.progress"
        :answered="props.progress.answered"
        :total="props.progress.total"
      />

      <div class="flex min-w-0 flex-1 justify-end">
        <slot />
      </div>
    </div>

    <!-- Full-bleed: the gutter is on the row above, not on the header. The count
         is already announced by QuizProgress, so the bar is decorative here. -->
    <Progress
      v-if="props.progress"
      :value="props.progress.answered"
      :max="props.progress.total"
      aria-hidden="true"
    />
  </header>
</template>
