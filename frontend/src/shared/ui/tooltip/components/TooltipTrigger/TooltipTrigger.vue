<script setup lang="ts">
import { inject } from 'vue';

import { TOOLTIP_CTX_KEY } from '../../constants';
import type { TooltipContext } from '../../Tooltip.types';

const ctx = inject<TooltipContext>(TOOLTIP_CTX_KEY)!;
</script>

<template>
  <div :ref="ctx.triggerRef">
    <slot />
  </div>
</template>
