<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

import { CharacterStatus } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';

import type { CharCardContext } from '../../../CharCardRoot.types';

const ctx = inject<CharCardContext>('charCardCtx');

const router = useRouter();

const isActive = computed(() => {
  return ctx?.status === CharacterStatus.ACTIVE;
});
const isPending = computed(() => {
  return ctx?.status === CharacterStatus.PENDING;
});

const handleCtaClick = () => {
  const id = ctx?.id;

  const redirectLink = isActive.value
    ? { name: RouteName.APP_CHARACTER, params: { id } }
    : { name: RouteName.APP_BUILDER, params: { id } };

  router.push(redirectLink);
};
</script>

<template>
  <Button @click="handleCtaClick" :variant="isActive ? 'secondary' : 'primary'">
    <span v-if="isActive">{{ 'To character' }}</span>

    <span v-else-if="isPending">{{ 'Start building' }}</span>

    <span v-else>{{ 'Continue building' }}</span>
  </Button>
</template>
