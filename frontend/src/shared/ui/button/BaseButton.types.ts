export type BaseButtonVariants = 'primary' | 'secondary' | 'transparent' | 'danger';
export type BaseButtonSizes = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: BaseButtonVariants;
  size?: BaseButtonSizes;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRound?: boolean;
  equalPadding?: boolean;
  type?: 'submit' | 'button' | 'reset';
}
