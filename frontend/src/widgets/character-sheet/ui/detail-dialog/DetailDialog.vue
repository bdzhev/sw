<script setup lang="ts">
import {
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import { Text } from '@shared/ui/text';

import type { DetailDialogProps } from './DetailDialog.types';

const props = defineProps<DetailDialogProps>();

const open = defineModel<boolean>('open', { required: true });
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <div class="flex min-w-0 flex-col gap-1">
            <DialogTitle class="truncate">{{ props.title }}</DialogTitle>

            <Text v-if="props.meta" size="xs" theme="secondary">{{ props.meta }}</Text>
          </div>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody class="pb-6">
          <Text v-if="props.description" size="sm" class="whitespace-pre-wrap">
            {{ props.description }}
          </Text>

          <Text v-else size="sm" theme="secondary">
            No description yet — add one from the edit form.
          </Text>
        </DialogBody>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
