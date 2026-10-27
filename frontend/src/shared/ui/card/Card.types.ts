export type CardVariant = 'primary' | 'secondary' | 'outline';

export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: CardVariant;
  size?: CardSize;
  blur?: boolean;
}
