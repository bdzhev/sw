<script setup lang="ts">
import { useForm } from 'vee-validate';

import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import {
  ModalCloseButton,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalCloser,
  ModalPortal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@shared/ui/modal';

import type { ValidationConfirmModalProps } from '../../ConfirmModal.types';

import { getValidationSchema } from './schema';

const props = defineProps<ValidationConfirmModalProps>();

const { meta } = useForm({ validationSchema: props.confirmationText ? getValidationSchema(props.confirmationText) : null });
</script>

<template>
  <ModalPortal>
    <ModalOverlay />

    <ModalContent>
      <ModalHeader>
        <ModalTitle>{{ props.modalTitle }}</ModalTitle>

        <ModalCloseButton />
      </ModalHeader>

      <ModalBody>
        <div class="flex flex-col gap-4">
          <ModalDescription>
            {{ props.modalDescription }}
          </ModalDescription>

          <div>
            <label for="confirmationText">{{ props.confirmationLabel }}</label>

            <Input class="pt-2" name="confirmationText" :clean-errors-on-focus="false" :show-error="false" />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div class="
          right-4 bottom-6 flex flex-row items-center justify-end gap-4
        ">
          <ModalCloser>
            <Button variant="secondary">{{ 'Cancel' }}</Button>
          </ModalCloser>

          <Button :is-disabled="!meta.valid" :variant="props.actionType === 'negative' ? 'danger' : 'primary'"
            @click="props?.onConfirm">
            {{ props.confirmButtonText || 'Confirm' }}
          </Button>
        </div>
      </ModalFooter>
    </ModalContent>
  </ModalPortal>
</template>
