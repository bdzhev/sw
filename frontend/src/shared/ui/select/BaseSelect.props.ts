interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  name: string;
  options: SelectOption[];
}
