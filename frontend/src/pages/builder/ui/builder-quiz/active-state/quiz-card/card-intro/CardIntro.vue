<script setup lang="ts">
import { ImageFolder } from '@shared/lib/assets';
import { CardHeader, HeaderTitle } from '@shared/ui/card';
import { Image } from '@shared/ui/image';
import { Text } from '@shared/ui/text';

import type { CardIntroProps } from './CardIntro.types';

const props = defineProps<CardIntroProps>();
</script>

<template>
  <div class="flex flex-col gap-4 md:w-2/5 md:shrink-0 md:overflow-hidden">
    <Image
      :folder="ImageFolder.Quiz"
      name="test-image-carousel"
      class="h-40 w-full shrink-0 object-cover md:h-1/2"
    />

    <CardHeader>
      <HeaderTitle>{{ props.title }}</HeaderTitle>
    </CardHeader>

    <Text>{{ props.description }}</Text>
  </div>
</template>
