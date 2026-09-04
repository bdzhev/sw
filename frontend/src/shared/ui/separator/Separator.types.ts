export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorProps {
  /** Defaults to `horizontal`. A vertical rule needs a parent with a height. */
  orientation?: SeparatorOrientation;
  /**
   * Purely visual — drops the `separator` role so assistive tech skips it. Leave
   * off when the rule is the only thing dividing two groups of content, since
   * then it carries meaning a sighted reader gets for free.
   */
  isDecorative?: boolean;
}
