export interface ModeSwitchOption {
  value: string;
  label: string;
}

export interface ModeSwitchProps {
  options: ModeSwitchOption[];
  /** Names the group for screen readers; the buttons carry the visible text. */
  legend: string;
}
