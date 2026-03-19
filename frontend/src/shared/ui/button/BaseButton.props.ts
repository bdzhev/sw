import type { BaseButtonVariants, BaseButtonSizes } from './BaseButton.types';

export interface ButtonProps {
  variant?: BaseButtonVariants;
  size?: BaseButtonSizes;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRound?: boolean;
  equalPadding?: boolean;
}
