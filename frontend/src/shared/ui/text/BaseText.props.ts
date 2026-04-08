type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type TextTheme = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';

export interface BaseTextProps {
  size?: TextSize;
  theme?: TextTheme;
}
