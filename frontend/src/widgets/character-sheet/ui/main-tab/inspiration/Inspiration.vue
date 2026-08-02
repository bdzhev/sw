<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';

import type { SheetPatch } from '@shared/api/characters';

import type { InspirationProps } from './Inspiration.types';

const props = defineProps<InspirationProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/** A checkbox on paper, and a single-shot edit — no debounce to carry it. */
const toggle = () => {
  emit('patch', { inspiration: !props.inspiration }, true);
};
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <h2 class="text-sm font-semibold text-primary uppercase">Inspiration</h2>

    <button
      type="button"
      role="switch"
      :aria-checked="props.inspiration"
      class="flex min-h-11 w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors"
      :class="
        props.inspiration
          ? 'border-accent-primary bg-accent-primary/15 text-primary'
          : 'border-border text-secondary hover:text-primary'
      "
      @click="toggle"
    >
      <span class="flex items-center gap-2">
        <Sparkles :size="18" />
        Inspired
      </span>

      <span class="text-xs uppercase">{{ props.inspiration ? 'yes' : 'no' }}</span>
    </button>
  </section>
</template>
