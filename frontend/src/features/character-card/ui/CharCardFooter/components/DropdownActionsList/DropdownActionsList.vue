<script setup lang="ts">
import { EllipsisVertical, Pencil, Trash } from 'lucide-vue-next';
import { provide, ref } from 'vue';

import { useBreakpoint } from '@shared/lib/ui';
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@shared/ui/dropdown-menu';
import { IconButton } from '@shared/ui/icon-button';

import { DeleteCharacterModal, EditCharacterModal } from './components';
import type { DropdownActionsContext } from './DropdownActionsList.types';

/**
 * Below md the two actions are laid out flat instead of behind a menu — a
 * touch user should not pay an extra tap, and there are only ever two of them.
 */
const { isMobile } = useBreakpoint();

const ACTION_BUTTON_CLASSES =
  'flex items-center justify-center rounded-sm bg-bg-secondary/50 text-secondary transition-all hover:bg-fg/50 hover:text-primary';
const TOUCH_TARGET_CLASSES = 'min-h-11 min-w-11';

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);

const toggleEditModal = () => {
  isEditModalOpen.value = !isEditModalOpen.value;
};

const toggleDeleteModal = () => {
  isDeleteModalOpen.value = !isDeleteModalOpen.value;
};

/**
 * Selecting an item both closes the menu and opens a dialog. The menu returns
 * focus to its trigger as it unmounts, which would pull focus straight out of
 * that dialog — so give it up when a dialog is what we opened.
 */
const handleCloseAutoFocus = (event: Event) => {
  if (isEditModalOpen.value || isDeleteModalOpen.value) {
    event.preventDefault();
  }
};

provide<DropdownActionsContext>('dropdownMenuActions', {
  isDeleteModalOpen,
  toggleDeleteModal,
  isEditModalOpen,
  toggleEditModal,
});
</script>

<template>
  <DeleteCharacterModal />

  <EditCharacterModal />

  <div v-if="isMobile" class="flex flex-row items-center gap-2">
    <IconButton
      :class="[ACTION_BUTTON_CLASSES, TOUCH_TARGET_CLASSES]"
      aria-label="Edit character"
      @click="toggleEditModal"
    >
      <Pencil :size="18" />
    </IconButton>

    <IconButton
      :class="[ACTION_BUTTON_CLASSES, TOUCH_TARGET_CLASSES]"
      aria-label="Delete character"
      @click="toggleDeleteModal"
    >
      <Trash :size="18" />
    </IconButton>
  </div>

  <DropdownMenuRoot v-else>
    <DropdownMenuTrigger as-child>
      <IconButton
        :class="ACTION_BUTTON_CLASSES"
        class="p-1"
        aria-label="Character actions"
      >
        <EllipsisVertical :size="18" />
      </IconButton>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent align="start" @close-auto-focus="handleCloseAutoFocus">
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
