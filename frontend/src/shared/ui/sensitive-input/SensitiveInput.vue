<script lang="ts" setup>
import { Eye, EyeOff } from 'lucide-vue-next';
import { ref } from 'vue';

import { Button } from '@shared/ui/button';
import { FormInput, type FormInputProps } from '@shared/ui/form-input';

type SensitiveInputProps = Omit<FormInputProps, 'type'>;

const props = defineProps<SensitiveInputProps>();

const isVisible = ref(false);

const handleToggleVisibility = (): void => {
  isVisible.value = !isVisible.value;
};
</script>

<template>
  <FormInput v-bind="props" :type="isVisible ? 'text' : 'password'">
    <template #right>
      <Button
        variant="transparent"
        is-icon-only
        class="mr-1 text-secondary"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        @click="handleToggleVisibility"
      >
        <EyeOff v-if="isVisible" class="size-4" />

        <Eye v-else class="size-4" />
      </Button>
    </template>
  </FormInput>
</template>
