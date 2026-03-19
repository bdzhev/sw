<script setup lang="ts">
import { ArrowRightToLine } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';

import { useSidebarUi } from '../../../model/useSidebarUi';

const uiStore = useSidebarUi();

const handleClick = () => {
  uiStore.toggleCollapsed();
};
</script>

<!--prettier-ignore-->
<template>
  <Button
    size="sm"
    variant="secondary"
    @click="handleClick"
    class="w-full"
    equal-padding
  >
    <div
      :class="[
        !uiStore.isCollapsed && 'rotate-[-180deg]',
        `transition-all duration-100`,
      ]"
    >
      <ArrowRightToLine :size="20" />
    </div>
  </Button>
</template>
