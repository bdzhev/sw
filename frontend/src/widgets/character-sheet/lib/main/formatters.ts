/** Modifiers and save totals read as signed numbers on a paper sheet. */
export const formatModifier = (value: number): string => {
  return value >= 0 ? `+${value}` : String(value);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

/** A cleared number input reads as `''` → `Number('')` is 0, not NaN. */
export const readNumberInput = (event: Event, fallback: number): number => {
  const raw = (event.target as HTMLInputElement).value;

  if (raw === '') return fallback;

  const parsed = Number(raw);

  return Number.isNaN(parsed) ? fallback : parsed;
};
