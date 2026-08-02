export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'transparent'
  | 'neutral'
  | 'accent'
  | 'warning'
  | 'danger';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * The button is a flex container, so it needs an explicit width or it stretches.
 * `fullOnMobile` is the mobile-CTA case: full-bleed on a phone, content-sized
 * from sm up. It lives here rather than as a consumer `class` because a
 * consumer's `w-full` cannot reliably beat the base `w-fit` — both are plain
 * utilities, so the winner would be decided by stylesheet order.
 */
export type ButtonWidth = 'fit' | 'full' | 'fullOnMobile';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRound?: boolean;
  equalPadding?: boolean;
  /**
   * Square padding and a 44px minimum box, for a button whose content is only
   * an icon. Composes with every `variant`, which is why there is no parallel
   * `icon-*` colour list to keep in step.
   *
   * An icon-only button has no text, so it needs an `aria-label` — pass one.
   */
  isIconOnly?: boolean;
  type?: 'submit' | 'button' | 'reset';
  /**
   * Render as something else — `as="a"`, or `:as="RouterLink"` for a
   * button-styled link. Defaults to a real `<button>`, and it must stay that
   * way by default: `type="submit"` inside a form, the native `disabled`
   * attribute that drives the `disabled:` variants, and reka's `as-child`
   * triggers all depend on the root being a button element.
   */
  as?: string | object;
}
