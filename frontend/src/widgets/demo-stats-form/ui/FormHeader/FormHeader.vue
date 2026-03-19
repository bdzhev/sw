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
      flex flex-row items-center justify-between bg-secondary-fg/30 px-8 py-6
    "
  >
    <h3 class="text-secondary">Try it out!</h3>

    <Button
      @click="handleResetClick"
      variant="secondary"
      equal-padding
      size="sm"
    >
      <RotateCcwIcon :size="16" />
    </Button>
  </div>
</template>
