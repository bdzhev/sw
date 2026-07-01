<script setup lang="ts">
import { ArrowRightToLine } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';

import { useSidebarUi } from '../../../model/useSidebarUi';

const uiStore = useSidebarUi();

const handleClick = () => {
  uiStore.toggleCollapsed();
};
</script>

<template>
  <Button
    size="xs"
    variant="secondary"
    @click="handleClick"
    class="w-full"
    equal-padding
  >
    <div
      :class="[
        !uiStore.isCollapsed && '-rotate-180',
        `transition-all duration-100`,
      ]"
    >
      <ArrowRightToLine :size="16" />
    </div>
  </Button>
</template>
