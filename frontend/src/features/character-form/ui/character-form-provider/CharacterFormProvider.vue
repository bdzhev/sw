<script setup lang="ts">
import { provide } from 'vue';

import type { CharacterFormProviderProps } from './CharacterFormProvider.types';
import { CHARACTER_FORM_CTX_KEY } from './constants';

const props = defineProps<CharacterFormProviderProps>();

const emit = defineEmits<{ submit: [event?: Event] }>();

provide(CHARACTER_FORM_CTX_KEY, props.formContext);

const handleSubmit = (event: Event): void => {
  emit('submit', event);
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>
