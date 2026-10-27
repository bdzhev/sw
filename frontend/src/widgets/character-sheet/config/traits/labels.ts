import { ResetTrigger, TraitTag } from '@shared/api/characters';
import type { SelectOption } from '@shared/ui/select';

export const TRAIT_TAG_LABELS: Record<TraitTag, string> = {
  [TraitTag.RACE]: 'Race',
  [TraitTag.CLASS]: 'Class',
  [TraitTag.OTHER]: 'Other',
};

export const TRAIT_TAG_OPTIONS: SelectOption[] = [
  { value: TraitTag.RACE, label: TRAIT_TAG_LABELS[TraitTag.RACE] },
  { value: TraitTag.CLASS, label: TRAIT_TAG_LABELS[TraitTag.CLASS] },
  { value: TraitTag.OTHER, label: TRAIT_TAG_LABELS[TraitTag.OTHER] },
];

/** `both` is a real state, not a fallback: a long rest restores what a short one does. */
export const RESET_TRIGGER_LABELS: Record<ResetTrigger, string> = {
  [ResetTrigger.SHORT]: 'Short rest',
  [ResetTrigger.LONG]: 'Long rest',
  [ResetTrigger.BOTH]: 'Short or long rest',
  [ResetTrigger.MANUAL]: 'Manual only',
};

export const RESET_TRIGGER_OPTIONS: SelectOption[] = [
  { value: ResetTrigger.SHORT, label: RESET_TRIGGER_LABELS[ResetTrigger.SHORT] },
  { value: ResetTrigger.LONG, label: RESET_TRIGGER_LABELS[ResetTrigger.LONG] },
  { value: ResetTrigger.BOTH, label: RESET_TRIGGER_LABELS[ResetTrigger.BOTH] },
  { value: ResetTrigger.MANUAL, label: RESET_TRIGGER_LABELS[ResetTrigger.MANUAL] },
];
