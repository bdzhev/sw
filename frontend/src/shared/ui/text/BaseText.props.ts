export type TextSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type TextTheme =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'warning'
  | 'danger';

export interface BaseTextProps {
  size?: TextSize;
  theme?: TextTheme;
}
