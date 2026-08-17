import type { Component } from 'vue';

export interface ToggleChipOption {
  value: string;
  label: string;
  icon?: Component;
}

export interface ToggleChipGroupProps {
  options: ToggleChipOption[];
  /** Names the group, as a visible `<legend>` in the shared field-label style. */
  legend: string;
  /** Keep the legend for screen readers, drop it visually. */
  isLegendHidden?: boolean;
  isDisabled?: boolean;
}
