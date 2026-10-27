<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';

import { MAX_CHARACTERS } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import {
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
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

import { useCharacterSummaries } from '@entities/characters';

import { CreateCharacterForm } from '../create-character-form';
import type { AddCharacterButtonProps } from './AddCharacterButton.types';

const LABEL = 'New character';

const DIALOG_TITLE = 'Create a new character';

const DIALOG_DESCRIPTION =
  "Enter a name, race and class for you new character. You won't be able to change the class or the race.";

const LIMIT_REACHED_LABEL = `You have reached the limit of ${MAX_CHARACTERS} characters. Delete one to create another.`;

/** The root is a fragment, so attrs have to be placed by hand. */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AddCharacterButtonProps>(), {
  isIconOnly: false,
});

const { t } = useI18n();

const { isAtCharacterLimit } = useCharacterSummaries();

const isOpen = ref(false);

onBeforeRouteLeave(() => {
  isOpen.value = false;
});

const handleTriggerClick = () => {
  isOpen.value = true;
};

const handleClose = () => {
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ t(DIALOG_TITLE) }}</DialogTitle>

          <DialogCloseButton />
        </DialogHeader>

        <DialogDescription class="px-6 pb-2 text-sm">
          {{ t(DIALOG_DESCRIPTION) }}
        </DialogDescription>

        <CreateCharacterForm @submit="handleClose" @cancel="handleClose" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
