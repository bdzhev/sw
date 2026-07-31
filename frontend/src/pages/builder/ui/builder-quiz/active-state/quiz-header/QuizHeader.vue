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
  <header
    class="flex flex-col items-stretch page-x py-3 md:flex-row md:items-center md:justify-end md:py-4"
  >
    <Button
      type="button"
      width="fullOnMobile"
      class="min-h-11 md:min-h-0"
      :is-disabled="!isValid || isCreating"
      :is-loading="isCreating"
      @click="$emit('create')"
    >
      {{ t('Create character') }}
    </Button>
  </header>
</template>
