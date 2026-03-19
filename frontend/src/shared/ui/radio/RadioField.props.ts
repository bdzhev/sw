import type { OptionItem } from './types';

export interface RadioFieldProps {
  name: string;
  items: OptionItem[];
  onSelect?: () => void;
}
