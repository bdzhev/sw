<script setup lang="ts">
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue';
import { inject, computed, onMounted, onBeforeUnmount } from 'vue';

import { TOOLTIP_CTX_KEY } from '../../constants';
import type { TooltipContext } from '../../Tooltip.types';

const ctx = inject<TooltipContext>(TOOLTIP_CTX_KEY)!;

const { x, y, strategy, update } = useFloating(ctx.triggerRef, ctx.contentRef, {
  placement: ctx.placement,
  middleware: [offset(ctx.offset), flip(), shift()],
});

const styles = computed(() => ({
  position: strategy.value,
  top: `${y.value}px`,
  left: `${x.value}px`,
  zIndex: 1000,
}));

let cleanup: (() => void) | null = null;

onMounted(() => {
  cleanup = autoUpdate(ctx.triggerRef.value!, ctx.contentRef.value!, update);
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<!--prettier-ignore-->
<template>
  <div
    :ref="ctx.contentRef"
    class="rounded-sm bg-bg-secondary/80 p-2 text-sm backdrop-blur-3xl"
    :style="styles"
  >
    <slot />
  </div>
</template>
