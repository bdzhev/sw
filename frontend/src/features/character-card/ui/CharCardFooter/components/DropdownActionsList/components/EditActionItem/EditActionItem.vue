<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import { inject } from 'vue';

import { DropdownMenuItem } from '@shared/ui/dropdown-menu';

import type { DropdownActionsContext } from '../../DropdownActionsList.types';

const ctx = inject<DropdownActionsContext>('dropdownMenuActions')!;

const handleClick = () => {
  ctx.toggleEditModal();
};
</script>

<template>
  <DropdownMenuItem v-on:click="handleClick">
    {{ 'Edit' }}
    <Pencil :size="16" />
  </DropdownMenuItem>
</template>
