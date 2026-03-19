import type {
  BaseConfirmModalProps,
  ValidationConfirmModalProps,
} from './ConfirmModal.types';

interface ValidationTypeModalProps extends ValidationConfirmModalProps {
  type: 'validation';
}

interface BasicTypeModalProps extends BaseConfirmModalProps {
  type?: 'basic';
}

export type ConfirmModalProps = ValidationTypeModalProps | BasicTypeModalProps;
