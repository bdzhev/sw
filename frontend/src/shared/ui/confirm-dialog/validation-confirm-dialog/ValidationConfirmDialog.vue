<script setup lang="ts">
import { useForm } from 'vee-validate';

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
import { Input } from '@shared/ui/input';

import type { ValidationConfirmDialogProps } from '../ConfirmDialog.types';
import { getValidationSchema } from './schema';

const props = defineProps<ValidationConfirmDialogProps>();

const { meta } = useForm({
  validationSchema: props.confirmationText
    ? getValidationSchema(props.confirmationText)
    : null,
});
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
        <div class="flex flex-col gap-4">
          <DialogDescription>
            {{ props.dialogDescription }}
          </DialogDescription>

          <div>
            <label for="confirmationText">{{ props.confirmationLabel }}</label>

            <Input
              class="pt-2"
              name="confirmationText"
              :clean-errors-on-focus="false"
              :show-error="false"
            />
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        <div class="flex flex-row items-center justify-end gap-4">
          <!-- `as-child` so the close lands on our Button instead of nesting one. -->
          <DialogClose as-child>
            <Button variant="secondary">{{ 'Cancel' }}</Button>
          </DialogClose>

          <Button
            :is-disabled="!meta.valid"
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
