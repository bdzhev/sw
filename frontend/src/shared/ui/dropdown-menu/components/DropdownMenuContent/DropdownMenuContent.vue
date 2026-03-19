<script setup lang="ts">
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';
import { inject, onMounted, onBeforeUnmount, computed } from 'vue';

import { FadeInTransition } from '@shared/ui/fade-in-transition';

import { DROPDOWN_MENU_CTX_KEY } from '../../constants';
import type { DropdownMenuContext } from '../../DropdownMenu.types';

const ctx = inject<DropdownMenuContext>(DROPDOWN_MENU_CTX_KEY)!;

onClickOutside(ctx.contentEl, () => {
  ctx.toggleOpen(false);
});

const { x, y, strategy, update } = useFloating(ctx.triggerEl, ctx.contentEl, {
  placement: ctx.placement,
  middleware: [offset(4), flip(), shift()],
});

let cleanup: (() => void) | null = null;

onMounted(() => {
  cleanup = autoUpdate(ctx.triggerEl.value!, ctx.contentEl.value!, update);
});

onBeforeUnmount(() => {
  cleanup?.();
});

const styles = computed(() => ({
  position: strategy.value,
  top: `${y.value}px`,
  left: `${x.value}px`,
  zIndex: 500,
}));
</script>

<template>
  <FadeInTransition>
    <div
      v-if="ctx?.isOpen?.value"
      :ref="ctx.contentEl"
      class="flex flex-col rounded-sm bg-fg"
      :style="styles"
    >
      <slot />
    </div>
  </FadeInTransition>
</template>
