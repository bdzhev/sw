<script setup lang="ts">
import { RotateCcwIcon } from 'lucide-vue-next';
import { inject } from 'vue';

import { Button } from '@shared/ui/button';

import { formContextKey } from '../../config/stats';
import type { DemoStatsFormContext } from '../../model/stats';

const formContext = inject<DemoStatsFormContext>(formContextKey);

const handleResetClick = () => {
  formContext?.resetForm();
};
</script>

<!--prettier-ignore-->
<template>
  <div
    class="
      flex flex-row items-center justify-between gap-4 bg-secondary-fg/30 px-5
      py-4
      md:px-8 md:py-6
    "
  >
    <h3 class="text-secondary">Try it out!</h3>

    <Button
      @click="handleResetClick"
      variant="secondary"
      equal-padding
      size="sm"
      aria-label="Reset stats"
      class="min-h-11 min-w-11 md:min-h-0 md:min-w-0"
    >
      <RotateCcwIcon :size="16" />
    </Button>
  </div>
</template>
