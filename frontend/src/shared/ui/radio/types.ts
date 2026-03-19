import type { Ref } from 'vue';

export interface OptionItem {
  label: string;
  value: string | number;
}

export interface RadioContext {
  onChange: (value: number | string) => void;
  items: OptionItem[];
  currentValue: Ref<string | number>;
  fieldName: string;
}
