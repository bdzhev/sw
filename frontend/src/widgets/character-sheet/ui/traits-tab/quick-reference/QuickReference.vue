<script setup lang="ts">
import { Pin } from 'lucide-vue-next';
import { computed } from 'vue';

import type { ClassResource, Trait } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { ResourceRow } from '../resource-row';
import { TraitRow } from '../trait-row';
import type { QuickReferenceProps } from './QuickReference.types';

const props = withDefaults(defineProps<QuickReferenceProps>(), { isSaving: false });

const emit = defineEmits<{
  traitInfo: [trait: Trait];
  traitEdit: [trait: Trait];
  traitRemove: [trait: Trait];
  traitTogglePin: [trait: Trait];
  resourceInfo: [resource: ClassResource];
  resourceEdit: [resource: ClassResource];
  resourceRemove: [resource: ClassResource];
  resourceTogglePin: [resource: ClassResource];
  spend: [resource: ClassResource, amount: number];
}>();

const isEmpty = computed(() => {
  return props.traits.length === 0 && props.resources.length === 0;
});
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-accent-primary/30 bg-bg-secondary/40 p-3 md:p-4"
  >
    <div class="flex items-center gap-2">
      <Pin :size="16" class="shrink-0 text-accent-primary" />

      <h4 class="text-primary">Quick reference</h4>
    </div>

    <Text v-if="isEmpty" size="sm" theme="secondary">
      Pin a trait or a resource to keep it one tap away during play.
    </Text>

    <ul v-else class="flex flex-col gap-2">
      <ResourceRow
        v-for="resource in props.resources"
        :key="resource.id"
        :resource="resource"
        :is-saving="props.isSaving"
        @info="emit('resourceInfo', resource)"
        @edit="emit('resourceEdit', resource)"
        @remove="emit('resourceRemove', resource)"
        @toggle-pin="emit('resourceTogglePin', resource)"
        @spend="
          (amount) => {
            return emit('spend', resource, amount);
          }
        "
      />

      <TraitRow
        v-for="trait in props.traits"
        :key="trait.id"
        :trait="trait"
        :is-saving="props.isSaving"
        @info="emit('traitInfo', trait)"
        @edit="emit('traitEdit', trait)"
        @remove="emit('traitRemove', trait)"
        @toggle-pin="emit('traitTogglePin', trait)"
      />
    </ul>
  </section>
</template>
