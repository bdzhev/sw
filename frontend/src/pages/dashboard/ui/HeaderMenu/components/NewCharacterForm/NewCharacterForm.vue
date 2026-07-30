<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';

import { CreateCharacterForm } from '@widgets/create-character-form';

import { useDashboardUiStore } from '../../../../model/useDashboardUiStore';

const store = useDashboardUiStore();

const closeDialog = () => {
  store.toggleIsNewCharacterFormOpen(false);
};
</script>

<template>
  <DialogRoot v-model:open="store.isNewCharacterFormOpen">
    <DialogPortal>
      <DialogOverlay />

      <!-- The form renders the visible heading, so this title is sr-only and
          exists only as reka's aria-labelledby target. -->
      <DialogContent :aria-describedby="undefined">
        <DialogTitle class="sr-only">{{ 'Create a new character' }}</DialogTitle>

        <CreateCharacterForm v-on:submit="closeDialog" v-on:cancel="closeDialog" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
