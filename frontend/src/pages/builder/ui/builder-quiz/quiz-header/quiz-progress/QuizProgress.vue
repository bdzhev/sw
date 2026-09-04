<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { QuizProgressProps } from './QuizProgress.types';

const props = defineProps<QuizProgressProps>();

const { t } = useI18n();
</script>

<template>
  <!-- Two copies, one per width: `hidden` is display:none, so exactly one is in
       the accessibility tree at any viewport. -->
  <p class="text-sm text-secondary tabular-nums" aria-live="polite">
    <span class="md:hidden">{{ props.answered }} / {{ props.total }}</span>

    <span class="hidden md:inline">
      {{
        t('{answered} out of {total} questions answered', {
          answered: props.answered,
          total: props.total,
        })
      }}
    </span>
  </p>
</template>
