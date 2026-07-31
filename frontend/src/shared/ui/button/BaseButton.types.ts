export type BaseButtonVariants = 'primary' | 'secondary' | 'transparent' | 'danger';
export type BaseButtonSizes = 'xs' | 'sm' | 'md' | 'lg';
/**
 * The button is a flex container, so it needs an explicit width or it stretches.
 * `fullOnMobile` is the mobile-CTA case: full-bleed on a phone, content-sized
 * from sm up. It lives here rather than as a consumer `class` because a
 * consumer's `w-full` cannot reliably beat the base `w-fit` — both are plain
 * utilities, so the winner would be decided by stylesheet order.
 */
export type BaseButtonWidth = 'fit' | 'full' | 'fullOnMobile';

export interface ButtonProps {
  variant?: BaseButtonVariants;
  size?: BaseButtonSizes;
  width?: BaseButtonWidth;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRound?: boolean;
  equalPadding?: boolean;
  type?: 'submit' | 'button' | 'reset';
}
