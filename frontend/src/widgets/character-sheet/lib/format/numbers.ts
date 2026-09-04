/**
 * Modifiers, saves and attack bonuses all read as signed numbers on paper.
 */
export const formatSigned = (value: number): string => {
  return value < 0 ? String(value) : `+${value}`;
};
