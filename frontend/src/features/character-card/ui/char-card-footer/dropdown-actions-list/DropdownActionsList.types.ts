import type { Ref } from 'vue';

export interface DropdownActionsContext {
  isDeleteModalOpen: Ref<boolean>;
  toggleDeleteModal: () => void;
  isEditModalOpen: Ref<boolean>;
  toggleEditModal: () => void;
}
