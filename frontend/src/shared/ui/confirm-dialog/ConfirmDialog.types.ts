type ConfirmDialogActionType = 'positive' | 'negative';

export interface BaseConfirmDialogProps {
  dialogTitle?: string;
  dialogDescription?: string;
  confirmButtonText?: string;
  onConfirm?: () => void | Promise<void>;
  actionType?: ConfirmDialogActionType;
  isLoading?: boolean;
}

export interface ValidationConfirmDialogProps extends BaseConfirmDialogProps {
  confirmationText?: string;
  confirmationLabel?: string;
}

interface ValidationTypeDialogProps extends ValidationConfirmDialogProps {
  type: 'validation';
}

interface BasicTypeDialogProps extends BaseConfirmDialogProps {
  type?: 'basic';
}

export type ConfirmDialogProps = ValidationTypeDialogProps | BasicTypeDialogProps;
