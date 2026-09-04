<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

import { Button } from '@shared/ui/button';

import type { BackButtonProps } from './BackButton.types';

const props = defineProps<BackButtonProps>();
</script>

<template>
  <Button
    :as="RouterLink"
    :to="props.to"
    variant="neutral"
    size="sm"
    is-icon-only
    class="shrink-0"
    :aria-label="props.label"
  >
    <ChevronLeft :size="18" />
  </Button>
</template>
