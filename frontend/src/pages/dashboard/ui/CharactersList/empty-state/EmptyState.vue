<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import { useDashboardUiStore } from '../../../model/useDashboardUiStore';

const store = useDashboardUiStore();

const handleCreateClick = () => {
  store.toggleIsNewCharacterFormOpen(true);
};
</script>

<template>
  <div class="flex flex-col items-center gap-4 py-12 text-center">
    <Text class="text-secondary">
      {{ 'No characters yet. Create one to start building.' }}
    </Text>

    <Button @click="handleCreateClick" class="min-h-11 md:min-h-0">
      {{ 'New character' }}
      <Plus :size="18" class="ml-1" />
    </Button>
  </div>
</template>
