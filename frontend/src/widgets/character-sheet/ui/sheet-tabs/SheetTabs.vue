<script setup lang="ts">
import type { SheetTab } from '@widgets/character-sheet/model/sheet-tabs';

import type { SheetTabsProps } from './SheetTabs.types';

const props = defineProps<SheetTabsProps>();

const emit = defineEmits<{ select: [tab: SheetTab] }>();
</script>

<template>
  <nav
    aria-label="Character sheet sections"
    class="-mx-4 overflow-x-auto border-b border-border px-4 md:mx-0 md:px-0"
  >
    <ul class="flex min-w-max gap-1 md:min-w-0">
      <li v-for="tab in props.tabs" :key="tab.id">
        <button
          type="button"
          :aria-current="tab.id === props.activeTab ? 'page' : undefined"
          class="border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors md:px-4"
          :class="
            tab.id === props.activeTab
              ? 'border-accent-primary text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          "
          @click="emit('select', tab.id)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>
