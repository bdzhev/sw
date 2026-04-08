<script lang="ts" setup>
import { Eye, EyeOff } from 'lucide-vue-next';
import { ref } from 'vue';

import { Input, type InputProps } from '../input';

type SensitiveInputProps = Omit<InputProps, 'type'>;

defineProps<SensitiveInputProps>();

const isVisible = ref(false);
</script>

<template>
  <Input v-bind="$props" :type="isVisible ? 'text' : 'password'">
    <template #right>
      <button
        type="button"
        class="mr-2 cursor-pointer text-secondary"
        @click="isVisible = !isVisible"
      >
        <EyeOff v-if="isVisible" class="size-4" />
        <Eye v-else class="size-4" />
      </button>
    </template>
  </Input>
</template>
