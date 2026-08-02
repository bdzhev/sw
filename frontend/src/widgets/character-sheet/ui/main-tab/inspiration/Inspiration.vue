<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Switch } from '@shared/ui/switch';

import type { InspirationProps } from './Inspiration.types';

const props = defineProps<InspirationProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/** A checkbox on paper, and a single-shot edit — no debounce to carry it. */
const isInspired = computed({
  get: (): boolean => {
    return props.inspiration;
  },
  set: (value: boolean): void => {
    emit('patch', { inspiration: value }, true);
  },
});
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <h2 class="text-sm font-semibold text-primary uppercase">Inspiration</h2>

    <Switch v-model="isInspired" label="Inspired">
      <template #icon>
        <Sparkles :size="18" aria-hidden="true" />
      </template>
    </Switch>
  </section>
</template>
