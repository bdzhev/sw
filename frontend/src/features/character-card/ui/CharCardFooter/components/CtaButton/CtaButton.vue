<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

import { CharacterStatus } from '@shared/api/characters';
import { Button } from '@shared/ui/button';

import type { CharCardContext } from '../../../CharCardRoot.types';

const ctx = inject<CharCardContext>('charCardCtx');

const router = useRouter();

const isActive = computed(() => {
  return ctx?.status === CharacterStatus.ACTIVE;
});

const handleCtaClick = () => {
  const charId = ctx?.id;

  const redirectLink = isActive.value
    ? `/app/settings/char/${charId}`
    : `/app/builder/${charId}`;

  router.push(redirectLink);
};
</script>

<template>
  <Button @click="handleCtaClick" :variant="isActive ? 'secondary' : 'primary'">
    <span v-if="isActive">
      {{ 'To character' }}
    </span>

    <span v-else>
      {{ 'Continue building' }}
    </span>
  </Button>
</template>
