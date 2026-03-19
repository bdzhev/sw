<script setup lang="ts">
import { inject } from 'vue';

import { FadeInTransition } from '../../../fade-in-transition';
import type { ModalContext } from '../../ModalRoot.types';

const ctx = inject<ModalContext>('modalContext');
</script>

<!--prettier-ignore-->
<template>
  <FadeInTransition>
    <Teleport to="body" v-if="ctx?.isOpen?.value">
      <div
        class="
          absolute top-0 left-0 z-1000 flex h-screen w-screen items-center
          justify-center
        "
      >
        <slot />
      </div>
    </Teleport>
  </FadeInTransition>
</template>
