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
  store.toggleIsNewCharacterFormOpen(!store.isNewCharacterFormOpen);
};
</script>

<template>
  <div class="sticky top-0 z-500 flex w-full flex-col">
    <div class="flex flex-row bg-bg-primary/50 px-6 py-4 backdrop-blur-3xl">
      <Button
        @click="handleAddButtonClick"
        :is-disabled="store.isNewCharacterFormOpen"
      >
        {{ 'New character' }}
        <Plus :size="18" class="ml-1" />
      </Button>
    </div>

    <NewCharacterForm
      class="absolute top-20 left-4 bg-bg-secondary/80 backdrop-blur-3xl"
    />
  </div>
</template>
