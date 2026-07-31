<script setup lang="ts">
import { CircleX } from 'lucide-vue-next';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button } from '@shared/ui/button';
import { Card, CardHeader, HeaderTitle } from '@shared/ui/card';
import { Text } from '@shared/ui/text';

import type { TryAgainCardProps } from './TryAgainCard.props';

const { t } = useI18n();

const props = defineProps<TryAgainCardProps>();

const isPending = ref(false);

const handleTryAgainClick = async () => {
  if (isPending.value) {
    return;
  }

  isPending.value = true;

  try {
    await props.onTryAgainClick();
  } catch {
    // backend messed up.
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <Card class="flex flex-col gap-4 p-5 md:p-6">
    <CardHeader v-if="props.title">
      <HeaderTitle>
        {{ t(props.title) }}
      </HeaderTitle>
    </CardHeader>

    <div class="flex flex-row items-center gap-4">
      <CircleX />
      <Text>{{ t(props.decription) }}</Text>
    </div>

    <Button
      :is-loading="isPending"
      width="fullOnMobile"
      class="min-h-11 md:min-h-0"
      @click="handleTryAgainClick"
    >
      {{ t('Try again') }}
    </Button>
  </Card>
</template>
