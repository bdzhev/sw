import type { Component } from 'vue';

export interface ToggleChipOption {
  value: string;
  label: string;
  icon?: Component;
}

export interface ToggleChipGroupProps {
  options: ToggleChipOption[];
  /** Names the group for screen readers; rendered as an `sr-only` legend. */
  legend: string;
  isDisabled?: boolean;
}
