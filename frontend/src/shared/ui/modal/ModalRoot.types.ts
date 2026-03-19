import type { Ref } from 'vue';

export interface ModalContext {
  isOpen: Ref<boolean>;
  toggleModal: (isOpen: boolean) => void;
  shouldCloseOnOutsideClick: boolean;
  onModalOpen?: () => void;
}
