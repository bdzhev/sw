<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';

import { MAX_CHARACTERS } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from '@shared/ui/tooltip';

import { useCharactersInfo } from '@entities/characters';

import { CreateCharacterForm } from '../create-character-form';
import type { AddCharacterButtonProps } from './AddCharacterButton.types';

const LABEL = 'New character';

const LIMIT_REACHED_LABEL = `You have reached the limit of ${MAX_CHARACTERS} characters. Delete one to create another.`;

/** The root is a fragment, so attrs have to be placed by hand. */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AddCharacterButtonProps>(), {
  isIconOnly: false,
});

const { t } = useI18n();

const { isAtCharacterLimit } = useCharactersInfo();

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
  <TooltipRoot>
    <TooltipTrigger as="span" tabindex="0" class="inline-flex w-fit">
      <Button
        v-bind="$attrs"
        @click="handleTriggerClick"
        :is-disabled="isAtCharacterLimit"
        :equal-padding="props.isIconOnly"
        :aria-label="props.isIconOnly ? t(LABEL) : undefined"
        class="min-h-11 min-w-11 md:min-h-0 md:min-w-0"
      >
        <span v-if="!props.isIconOnly">{{ t(LABEL) }}</span>

        <Plus :size="18" :class="{ 'ml-1': !props.isIconOnly }" />
      </Button>
    </TooltipTrigger>

    <TooltipPortal v-if="isAtCharacterLimit">
      <TooltipContent class="max-w-64">{{ t(LIMIT_REACHED_LABEL) }}</TooltipContent>
    </TooltipPortal>
  </TooltipRoot>

  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogTitle class="sr-only">{{ t('Create a new character') }}</DialogTitle>

        <CreateCharacterForm v-on:submit="closeDialog" v-on:cancel="closeDialog" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
