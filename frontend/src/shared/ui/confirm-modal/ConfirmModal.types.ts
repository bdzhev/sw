type ConfirmModalActionType = 'positive' | 'negative';

export interface BaseConfirmModalProps {
  modalTitle?: string;
  modalDescription?: string;
  confirmButtonText?: string;
  onConfirm?: () => void | Promise<void>;
  actionType?: ConfirmModalActionType;
  isLoading?: boolean;
}

export interface ValidationConfirmModalProps extends BaseConfirmModalProps {
  confirmationText?: string;
  confirmationLabel?: string;
}
