<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import z4 from 'zod/v4';

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

const props = defineProps<ValidationConfirmModalProps>();

const schema = toTypedSchema(
  z4.object({
    confirmationText: z4.string('').refine((val) => {
      return val === props.confirmationText;
    }, ''),
  }),
);

const { meta } = useForm({
  validationSchema: schema,
});
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
          <ModalCloser v-slot="{ onClick }">
            <Button variant="secondary" @click="onClick">{{ 'Cancel' }}</Button>
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
