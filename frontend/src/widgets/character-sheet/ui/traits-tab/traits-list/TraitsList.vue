<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

import type { Trait } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import { Text } from '@shared/ui/text';

import { TraitRow } from '../trait-row';
import type { TraitsListProps } from './TraitsList.types';

const props = withDefaults(defineProps<TraitsListProps>(), { isSaving: false });

const emit = defineEmits<{
  add: [];
  info: [trait: Trait];
  edit: [trait: Trait];
  remove: [trait: Trait];
  togglePin: [trait: Trait];
}>();
</script>

<template>
  <section class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <h4 class="text-primary">Traits &amp; features</h4>

      <Button size="xs" class="min-h-11" @click="emit('add')">
        <span class="flex items-center gap-1">
          <Plus :size="16" />
          Add
        </span>
      </Button>
    </div>

    <Text v-if="!props.traits.length" size="sm" theme="secondary">
      Nothing here yet. Add racial abilities, class features and feats as you learn them.
    </Text>

    <ul v-else class="flex flex-col gap-2">
      <TraitRow
        v-for="trait in props.traits"
        :key="trait.id"
        :trait="trait"
        :is-saving="props.isSaving"
        @info="emit('info', trait)"
        @edit="emit('edit', trait)"
        @remove="emit('remove', trait)"
        @toggle-pin="emit('togglePin', trait)"
      />
    </ul>
  </section>
</template>
