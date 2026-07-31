<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';

import { Button } from '@shared/ui/button';
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';

import { CreateCharacterForm } from '../create-character-form';
import type { AddCharacterButtonProps } from './AddCharacterButton.types';

const LABEL = 'New character';

/** The root is a fragment, so attrs have to be placed by hand. */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AddCharacterButtonProps>(), {
  isIconOnly: false,
});

const { t } = useI18n();

const isOpen = ref(false);

onBeforeRouteLeave(() => {
  isOpen.value = false;
});

const handleTriggerClick = () => {
  isOpen.value = true;
};

const closeDialog = () => {
  isOpen.value = false;
};
</script>

<template>
  <Button
    v-bind="$attrs"
    @click="handleTriggerClick"
    :equal-padding="props.isIconOnly"
    :aria-label="props.isIconOnly ? t(LABEL) : undefined"
    class="min-h-11 min-w-11 md:min-h-0 md:min-w-0"
  >
    <span v-if="!props.isIconOnly">{{ t(LABEL) }}</span>

    <Plus :size="18" :class="{ 'ml-1': !props.isIconOnly }" />
  </Button>

  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay />

      <!-- The form renders the visible heading; this only feeds aria-labelledby. -->
      <DialogContent :aria-describedby="undefined">
        <DialogTitle class="sr-only">{{ t('Create a new character') }}</DialogTitle>

        <CreateCharacterForm v-on:submit="closeDialog" v-on:cancel="closeDialog" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
