<script setup lang="ts">
import { computed, inject } from 'vue';
import { type RouteLocationRaw, useRouter } from 'vue-router';

import { CharacterStatus } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';

import type { CharCardContext } from '@features/character-card/ui/char-card-root';

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

  if (!id) {
    return;
  }

  const redirectLink: RouteLocationRaw = isActive.value
    ? { name: RouteName.APP_CHARACTER, params: { id } }
    : { name: RouteName.APP_BUILDER, params: { id } };

  void router.push(redirectLink);
};
</script>

<template>
  <Button
    @click="handleCtaClick"
    :variant="isActive ? 'secondary' : 'primary'"
    class="min-h-11 md:min-h-0"
  >
    <span v-if="isActive">{{ 'To character' }}</span>

    <span v-else-if="isPending">{{ 'Start building' }}</span>

    <span v-else>{{ 'Continue building' }}</span>
  </Button>
</template>
