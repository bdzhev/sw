import { SpellcastingProgression } from '@shared/api/characters';
import type { SelectOption } from '@shared/ui/select';

export const SPELL_NAME_MAX_LENGTH = 60;
export const SPELL_DESCRIPTION_MAX_LENGTH = 2000;

/** Mirrors MAX_SLOT_COUNT in the backend's character.schemas.ts. */
export const MAX_SLOT_COUNT = 99;

/**
 * `custom` is what an override that no table covers falls back to; `third` is
 * the one an eldritch knight or arcane trickster reaches for, which is why the
 * list is offered on every class rather than only on the casters.
 */
export const PROGRESSION_LABELS: Record<SpellcastingProgression, string> = {
  [SpellcastingProgression.FULL]: 'Full caster',
  [SpellcastingProgression.HALF]: 'Half caster',
  [SpellcastingProgression.THIRD]: 'Third caster',
  [SpellcastingProgression.PACT]: 'Pact magic',
  [SpellcastingProgression.NONE]: 'Not a caster',
  [SpellcastingProgression.CUSTOM]: 'Custom slots',
};

export const PROGRESSION_OPTIONS: SelectOption[] = [
  {
    value: SpellcastingProgression.FULL,
    label: PROGRESSION_LABELS[SpellcastingProgression.FULL],
  },
  {
    value: SpellcastingProgression.HALF,
    label: PROGRESSION_LABELS[SpellcastingProgression.HALF],
  },
  {
    value: SpellcastingProgression.THIRD,
    label: PROGRESSION_LABELS[SpellcastingProgression.THIRD],
  },
  {
    value: SpellcastingProgression.PACT,
    label: PROGRESSION_LABELS[SpellcastingProgression.PACT],
  },
  {
    value: SpellcastingProgression.CUSTOM,
    label: PROGRESSION_LABELS[SpellcastingProgression.CUSTOM],
  },
  {
    value: SpellcastingProgression.NONE,
    label: PROGRESSION_LABELS[SpellcastingProgression.NONE],
  },
];

/** The highest slot level in the rules — the slot grid always renders all of them. */
export const MAX_SLOT_LEVEL = 9;

/** The freeform entry's level picker. Cantrip first, then 1..9. */
export const SPELL_LEVEL_OPTIONS: SelectOption[] = [
  { value: 0, label: 'Cantrip' },
  ...Array.from({ length: MAX_SLOT_LEVEL }, (_, index) => {
    return { value: index + 1, label: `Level ${index + 1}` };
  }),
];

/**
 * Above this, the collapsed summary shows a count instead of circles.
 * `MAX_SLOT_COUNT` is 99, and ninety-nine circles is not a summary.
 */
export const MAX_PIP_COUNT = 12;
