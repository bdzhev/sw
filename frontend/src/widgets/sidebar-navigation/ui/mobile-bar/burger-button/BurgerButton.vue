<script setup lang="ts">
import { Menu } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';

import { useSidebarUi } from '../../../model/useSidebarUi';

const uiStore = useSidebarUi();

const handleClick = () => {
  uiStore.setDrawerOpen(true);
};
</script>

<template>
  <Button
    variant="transparent"
    size="sm"
    equal-padding
    aria-label="Open navigation"
    :aria-expanded="uiStore.isDrawerOpen"
    class="min-h-11 min-w-11"
    @click="handleClick"
  >
    <Menu :size="20" />
  </Button>
</template>
