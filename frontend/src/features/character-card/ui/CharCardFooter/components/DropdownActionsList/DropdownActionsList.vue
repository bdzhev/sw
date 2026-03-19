<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next';
import { provide, ref } from 'vue';

import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@shared/ui/dropdown-menu';
import { IconButton } from '@shared/ui/icon-button';

import { DeleteCharacterModal, EditCharacterModal } from './components';
import type { DropdownActionsContext } from './DropdownActionsList.types';

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);

const toggleEditModal = () => {
  isEditModalOpen.value = !isEditModalOpen.value;
};

const toggleDeleteModal = () => {
  isDeleteModalOpen.value = !isDeleteModalOpen.value;
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

  <DropdownMenuRoot :close-on-outside-click="false" portal-to="main">
    <DropdownMenuTrigger>
      <IconButton class="
        rounded-sm bg-bg-secondary/50 p-1 text-secondary transition-all
        hover:bg-fg/50 hover:text-primary
      ">
        <EllipsisVertical :size="18" />
      </IconButton>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent>
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
