<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import type { ClassResource } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { Separator } from '@shared/ui/separator';
import { Text } from '@shared/ui/text';

import { useTraitsUi } from '@widgets/character-sheet/model/traits';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { ResourceRow } from '../resource-row';
import type { ResourcesListProps } from './ResourcesList.types';

const props = withDefaults(defineProps<ResourcesListProps>(), { isSaving: false });

const emit = defineEmits<{
  togglePin: [resource: ClassResource];
  spend: [resource: ClassResource, amount: number];
}>();

const ui = useTraitsUi();

const handleAddClick = (): void => {
  ui.openResourceDialog(null);
};

const handleTogglePin = (resource: ClassResource): void => {
  emit('togglePin', resource);
};

const handleSpend = (resource: ClassResource, amount: number): void => {
  emit('spend', resource, amount);
};
</script>

<template>
  <SheetSection title="Class resources" variant="plain">
    <template #actions>
      <Button size="xs" class="min-h-11" @click="handleAddClick">
        <span class="flex items-center gap-1">
          <Plus :size="16" />
          Add
        </span>
      </Button>
    </template>

    <Separator />

    <Text v-if="!props.resources.length" size="sm" theme="secondary">
      No pools tracked. Add rage, ki, channel divinity — or anything homebrew.
    </Text>

    <ul v-else class="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <ResourceRow
        v-for="resource in props.resources"
        :key="resource.id"
        :resource="resource"
        :is-saving="props.isSaving"
        @toggle-pin="handleTogglePin"
        @spend="handleSpend"
      />
    </ul>
  </SheetSection>
</template>
