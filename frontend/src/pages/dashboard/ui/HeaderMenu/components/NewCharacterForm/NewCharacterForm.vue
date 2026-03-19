<script setup lang="ts">
import { FadeInTransition } from '@shared/ui/fade-in-transition';

import { CreateCharacterForm } from '@widgets/create-character-form';

import { useDashboardUiStore } from '../../../../model/useDashboardUiStore';

const store = useDashboardUiStore();

const handleFormSubmit = () => {
  store.toggleIsNewCharacterFormOpen(false);
};

const handleCancel = () => {
  store.toggleIsNewCharacterFormOpen(false);
};
</script>

<template>
  <FadeInTransition>
    <CreateCharacterForm
      v-if="store.isNewCharacterFormOpen"
      ref="formRef"
      v-on:submit="handleFormSubmit"
      v-on:cancel="handleCancel"
      class="w-100 rounded-lg"
    />
  </FadeInTransition>
</template>
