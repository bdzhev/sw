<script setup lang="ts">
import { RouterLink } from 'vue-router';

import type { SheetTabsProps } from './SheetTabs.types';

const props = defineProps<SheetTabsProps>();
</script>

<template>
  <nav
    aria-label="Character sheet sections"
    class="page-x-bleed overflow-x-auto border-b border-border"
  >
    <ul class="flex min-w-max gap-1 md:min-w-0">
      <li v-for="tab in props.tabs" :key="tab.id">
        <RouterLink
          :to="tab.to"
          replace
          :aria-current="tab.id === props.activeTab ? 'page' : undefined"
          class="flex min-h-11 items-center border-b-2 px-3 text-sm whitespace-nowrap transition-colors md:px-4"
          :class="
            tab.id === props.activeTab
              ? 'border-accent-primary text-primary'
              : 'border-transparent text-secondary hover:text-primary'
          "
        >
          {{ tab.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
