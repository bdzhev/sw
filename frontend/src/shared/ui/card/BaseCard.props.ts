type BaseCardVariants = 'primary' | 'secondary' | 'outline';
type BaseCardSizes = 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: BaseCardVariants;
  size?: BaseCardSizes;
  blur?: boolean;
}
