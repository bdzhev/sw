<script setup lang="ts">
import { Button } from '@shared/ui/button';
import {
  ModalCloseButton,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalCloser,
  ModalPortal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@shared/ui/modal';

import { type BaseConfirmModalProps } from '../../ConfirmModal.types';

const props = defineProps<BaseConfirmModalProps>();
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
        <ModalDescription class="pt-4">
          {{ props.modalDescription }}
        </ModalDescription>
      </ModalBody>

      <ModalFooter>
        <div class="
          right-4 bottom-6 flex flex-row items-center justify-end gap-4
        ">
          <ModalCloser v-slot="{ onClick }">
            <Button variant="secondary" @click="onClick" :is-disabled="props.isLoading">{{ 'Cancel' }}</Button>
          </ModalCloser>

          <Button :variant="props.actionType === 'negative' ? 'danger' : 'primary'" @click="props?.onConfirm"
            :is-loading="props.isLoading">
            {{ props.confirmButtonText || 'Confirm' }}
          </Button>
        </div>
      </ModalFooter>
    </ModalContent>
  </ModalPortal>
</template>
