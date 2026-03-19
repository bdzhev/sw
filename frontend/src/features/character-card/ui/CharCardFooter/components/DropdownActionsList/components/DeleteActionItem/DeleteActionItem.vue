<script setup lang="ts">
import { Trash } from 'lucide-vue-next';
import { inject } from 'vue';

import { DropdownMenuItem } from '@shared/ui/dropdown-menu';

import type { DropdownActionsContext } from '../../DropdownActionsList.types';

const ctx = inject<DropdownActionsContext>('dropdownMenuActions')!;

const handleClick = () => {
  ctx.toggleDeleteModal();
};
</script>

<template>
  <DropdownMenuItem v-on:click="handleClick">
    {{ 'Delete' }}
    <Trash :size="16" />
  </DropdownMenuItem>
</template>
