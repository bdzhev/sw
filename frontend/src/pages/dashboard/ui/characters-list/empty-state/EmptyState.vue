<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Text } from '@shared/ui/text';

import { AddCharacterButton } from '@widgets/create-character';

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center gap-4 py-12 text-center">
    <Text class="text-secondary">
      {{ t('No characters yet. Create one to start building.') }}
    </Text>

    <AddCharacterButton />
  </div>
</template>
