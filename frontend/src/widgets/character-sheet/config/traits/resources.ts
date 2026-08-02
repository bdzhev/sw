import { ResetTrigger } from '@shared/api/characters';
import type { SelectOption } from '@shared/ui/select';

import type { KnownResource, ResourceSubAbility } from './types';

/** The `resource` select's escape hatch: a freeform, player-named pool. */
export const CUSTOM_RESOURCE_VALUE = 'custom';

/**
 * The ten official class resources across the twelve base classes. Static and
 * small, so no fetch and no filter UI.
 *
 * Reset triggers are filled in only for the six the design doc sources; the
 * other four are `null` and land on "manual only" until someone transcribes them
 * from the SRD. Maxima are absent entirely — see `resource-dialog`.
 */
export const KNOWN_RESOURCES: KnownResource[] = [
  { key: 'rage', label: 'Rage', resetTrigger: ResetTrigger.LONG },
  {
    key: 'bardic-inspiration',
    label: 'Bardic Inspiration',
    resetTrigger: ResetTrigger.BOTH,
  },
  { key: 'channel-divinity', label: 'Channel Divinity', resetTrigger: ResetTrigger.BOTH },
  { key: 'wild-shape', label: 'Wild Shape', resetTrigger: null },
  { key: 'second-wind', label: 'Second Wind', resetTrigger: null },
  { key: 'action-surge', label: 'Action Surge', resetTrigger: null },
  { key: 'ki-points', label: 'Ki Points', resetTrigger: ResetTrigger.BOTH },
  { key: 'lay-on-hands', label: 'Lay on Hands', resetTrigger: ResetTrigger.LONG },
  { key: 'sorcery-points', label: 'Sorcery Points', resetTrigger: ResetTrigger.LONG },
  { key: 'arcane-recovery', label: 'Arcane Recovery', resetTrigger: null },
];

export const KNOWN_RESOURCE_LABELS: Record<string, string> = Object.fromEntries(
  KNOWN_RESOURCES.map((resource) => {
    return [resource.key, resource.label];
  }),
);

export const KNOWN_RESET_TRIGGERS: Record<string, ResetTrigger> = Object.fromEntries(
  KNOWN_RESOURCES.filter((resource) => {
    return resource.resetTrigger !== null;
  }).map((resource) => {
    return [resource.key, resource.resetTrigger as ResetTrigger];
  }),
);

export const RESOURCE_OPTIONS: SelectOption[] = [
  ...KNOWN_RESOURCES.map((resource) => {
    return { value: resource.key, label: resource.label };
  }),
  { value: CUSTOM_RESOURCE_VALUE, label: 'Custom (homebrew)' },
];

/**
 * Sub-ability costs exactly as the design doc lists them — the one part of the
 * rules data that *is* sourced. A resource absent from this map is a single
 * activation with no cost variation, so its "use" is one flat tap.
 */
export const RESOURCE_SUB_ABILITIES: Record<string, ResourceSubAbility[]> = {
  'ki-points': [
    { name: 'Flurry of Blows', cost: 1 },
    { name: 'Patient Defense', cost: 1 },
    { name: 'Step of the Wind', cost: 1 },
    { name: 'Stunning Strike', cost: 1, note: 'from level 5' },
    { name: 'Quivering Palm', cost: 3, note: 'Way of the Open Hand, from level 17' },
  ],
  'sorcery-points': [
    { name: 'Careful Spell', cost: 1 },
    { name: 'Distant Spell', cost: 1 },
    { name: 'Empowered Spell', cost: 1 },
    { name: 'Extended Spell', cost: 1 },
    { name: 'Subtle Spell', cost: 1 },
    { name: 'Quickened Spell', cost: 2 },
    { name: 'Heightened Spell', cost: 3 },
    { name: 'Twinned Spell', cost: null, note: "the spell's level, minimum 1" },
    { name: 'Create 1st-level slot', cost: 2 },
    { name: 'Create 2nd-level slot', cost: 3 },
    { name: 'Create 3rd-level slot', cost: 5 },
    { name: 'Create 4th-level slot', cost: 6 },
    { name: 'Create 5th-level slot', cost: 7 },
  ],
  'lay-on-hands': [
    { name: 'Heal HP', cost: null, note: 'any amount up to the pool' },
    { name: 'Cure Disease or Poison', cost: 5 },
  ],
};
