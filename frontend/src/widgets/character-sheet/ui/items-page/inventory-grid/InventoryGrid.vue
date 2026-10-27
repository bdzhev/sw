<script setup lang="ts">
import { MAX_ITEMS, type InventoryItem } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { InventoryGridProps } from './InventoryGrid.types';
import { ItemCard } from './item-card';

const props = withDefaults(defineProps<InventoryGridProps>(), {
  isSaving: false,
  hasReachedLimit: false,
});

const emit = defineEmits<{
  togglePin: [item: InventoryItem];
  toggleEquipped: [item: InventoryItem];
  spend: [item: InventoryItem];
}>();

const LIMIT_REACHED_LABEL = `You are carrying the maximum of ${MAX_ITEMS} items. Delete one to add another.`;

const handleTogglePin = (item: InventoryItem): void => {
  emit('togglePin', item);
};

const handleToggleEquipped = (item: InventoryItem): void => {
  emit('toggleEquipped', item);
};

const handleSpend = (item: InventoryItem): void => {
  emit('spend', item);
};
</script>

<template>
  <!-- No title and no Add button: the page header above carries both. -->
  <SheetSection variant="plain">
    <Text v-if="props.hasReachedLimit" size="xs" theme="secondary">
      {{ LIMIT_REACHED_LABEL }}
    </Text>

    <Text v-if="!props.items.length" size="sm" theme="secondary">
      Nothing carried yet. Add potions, a rope, that suspiciously heavy belt.
    </Text>

    <!--
      Two per row on a phone, three from md up — md is 48rem, the tablet
      breakpoint, so tablet and desktop share the three-up layout and there is
      deliberately no lg step.
    -->
    <ul v-else class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      <ItemCard
        v-for="item in props.items"
        :key="item.id"
        :item="item"
        :is-saving="props.isSaving"
        @toggle-pin="handleTogglePin"
        @toggle-equipped="handleToggleEquipped"
        @spend="handleSpend"
      />
    </ul>
  </SheetSection>
</template>
