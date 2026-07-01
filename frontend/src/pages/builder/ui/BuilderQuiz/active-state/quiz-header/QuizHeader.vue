<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Button } from '@shared/ui/button';

defineProps<{
  isValid: boolean;
  isCreating: boolean;
}>();

defineEmits<{
  create: [];
}>();

const { t } = useI18n();
</script>

<template>
  <header class="flex items-center justify-end py-4">
    <Button
      type="button"
      :is-disabled="!isValid || isCreating"
      :is-loading="isCreating"
      @click="$emit('create')"
    >
      {{ t('Create character') }}
    </Button>
  </header>
</template>
