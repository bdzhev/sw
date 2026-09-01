import type { ToggleChipOption } from '@shared/ui/toggle-chip-group';

/**
 * Suggestions, not a domain enum — the column takes any string and encodes no
 * mechanical effect, which is why this list lives here rather than in the
 * entity next to `STANDARD_LANGUAGES`. Lowercase because the value is what the
 * badge renders.
 */
const SRD_CONDITIONS = [
  'blinded',
  'charmed',
  'deafened',
  'exhaustion',
  'frightened',
  'grappled',
  'incapacitated',
  'invisible',
  'paralyzed',
  'petrified',
  'poisoned',
  'prone',
  'restrained',
  'stunned',
  'unconscious',
] as const;

export const CONDITION_OPTIONS: ToggleChipOption[] = SRD_CONDITIONS.map((condition) => {
  return { value: condition, label: condition };
});
