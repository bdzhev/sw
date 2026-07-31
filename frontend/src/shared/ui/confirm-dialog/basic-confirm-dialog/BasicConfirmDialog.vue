<script setup lang="ts">
import { Button } from '@shared/ui/button';
import {
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@shared/ui/dialog';

import type { BaseConfirmDialogProps } from '../ConfirmDialog.types';

const props = defineProps<BaseConfirmDialogProps>();
</script>

<template>
  <DialogPortal>
    <DialogOverlay />

    <DialogContent :disable-outside-close="props.isLoading">
      <DialogHeader>
        <DialogTitle>{{ props.dialogTitle }}</DialogTitle>

        <DialogCloseButton />
      </DialogHeader>

      <DialogBody>
        <DialogDescription class="pt-4">
          {{ props.dialogDescription }}
        </DialogDescription>
      </DialogBody>

      <DialogFooter>
        <div class="flex flex-row items-center justify-end gap-4">
          <DialogClose as-child>
            <Button variant="secondary" :is-disabled="props.isLoading">
              {{ 'Cancel' }}
            </Button>
          </DialogClose>

          <Button
            :variant="props.actionType === 'negative' ? 'danger' : 'primary'"
            :is-loading="props.isLoading"
            @click="props?.onConfirm"
          >
            {{ props.confirmButtonText || 'Confirm' }}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</template>
