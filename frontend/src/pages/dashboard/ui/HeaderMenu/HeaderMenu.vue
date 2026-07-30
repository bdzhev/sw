<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { onBeforeRouteLeave } from 'vue-router';

import { Button } from '@shared/ui/button';

import { useDashboardUiStore } from '../../model/useDashboardUiStore';
import { NewCharacterForm } from './components';

const store = useDashboardUiStore();

onBeforeRouteLeave(() => {
  store.toggleIsNewCharacterFormOpen(false);
});

const handleAddButtonClick = () => {
  store.toggleIsNewCharacterFormOpen(true);
};
</script>

<template>
  <header
    class="sticky top-mobile-bar z-500 flex w-full flex-row bg-bg-primary/50 page-x py-3 backdrop-blur-3xl md:top-0 md:py-4"
  >
    <Button @click="handleAddButtonClick" class="min-h-11 md:min-h-0">
      {{ 'New character' }}
      <Plus :size="18" class="ml-1" />
    </Button>
  </header>

  <NewCharacterForm />
</template>
