import {
  ArrowUpRight,
  Brain,
  CloudLightning,
  Droplets,
  Feather,
  Flame,
  FlaskConical,
  Grab,
  Hammer,
  MoveHorizontal,
  Shuffle,
  Skull,
  Slash,
  Snowflake,
  Sparkles,
  Sun,
  Weight,
  Zap,
} from 'lucide-vue-next';
import type { Component } from 'vue';

import { AttackAbility, AttackDelivery, CharacterStat } from '@shared/api/characters';
import type { SelectOption } from '@shared/ui/select';

import type { AttackPropertyDefinition } from './types';

export const ATTACK_NAME_MAX_LENGTH = 60;
export const DAMAGE_DICE_MAX_LENGTH = 24;
export const ADDITIONAL_BONUS_LIMIT = 99;
export const AMMO_LIMIT = 999;
export const INITIATIVE_BONUS_LIMIT = 20;

export const ABILITY_LABELS: Record<AttackAbility, string> = {
  [AttackAbility.STRENGTH]: 'Strength',
  [AttackAbility.DEXTERITY]: 'Dexterity',
  [AttackAbility.FINESSE]: 'Finesse',
};

export const ABILITY_OPTIONS: SelectOption[] = [
  { value: AttackAbility.STRENGTH, label: 'Strength' },
  { value: AttackAbility.DEXTERITY, label: 'Dexterity' },
  { value: AttackAbility.FINESSE, label: 'Finesse — best of Str or Dex' },
];

export const DELIVERY_LABELS: Record<AttackDelivery, string> = {
  [AttackDelivery.MELEE]: 'Melee',
  [AttackDelivery.THROWN]: 'Thrown',
  [AttackDelivery.RANGED_BOW]: 'Ranged (bow)',
  [AttackDelivery.RANGED_FIREARM]: 'Ranged (firearm)',
};

export const DELIVERY_OPTIONS: SelectOption[] = [
  { value: AttackDelivery.MELEE, label: DELIVERY_LABELS[AttackDelivery.MELEE] },
  { value: AttackDelivery.THROWN, label: DELIVERY_LABELS[AttackDelivery.THROWN] },
  {
    value: AttackDelivery.RANGED_BOW,
    label: DELIVERY_LABELS[AttackDelivery.RANGED_BOW],
  },
  {
    value: AttackDelivery.RANGED_FIREARM,
    label: DELIVERY_LABELS[AttackDelivery.RANGED_FIREARM],
  },
];

/** The short names the breakdown line uses, so it stays readable at 320px. */
export const STAT_LABELS: Record<CharacterStat, string> = {
  [CharacterStat.STR]: 'Str',
  [CharacterStat.DEX]: 'Dex',
  [CharacterStat.CON]: 'Con',
  [CharacterStat.INT]: 'Int',
  [CharacterStat.WIS]: 'Wis',
  [CharacterStat.CHA]: 'Cha',
};

/** The thirteen standard damage types, so the list can show a consistent icon. */
export const DAMAGE_TYPE_ICONS: Record<string, Component> = {
  acid: Droplets,
  bludgeoning: Hammer,
  cold: Snowflake,
  fire: Flame,
  force: Sparkles,
  lightning: Zap,
  necrotic: Skull,
  piercing: ArrowUpRight,
  poison: FlaskConical,
  psychic: Brain,
  radiant: Sun,
  slashing: Slash,
  thunder: CloudLightning,
};

export const DAMAGE_TYPE_OPTIONS: SelectOption[] = Object.keys(DAMAGE_TYPE_ICONS).map(
  (type) => {
    return { value: type, label: `${type.charAt(0).toUpperCase()}${type.slice(1)}` };
  },
);

/**
 * Finesse is deliberately absent — it is an ability-select option, because it
 * changes which modifier the calc uses rather than describing the weapon.
 */
export const ATTACK_PROPERTIES: AttackPropertyDefinition[] = [
  {
    key: 'versatile',
    label: 'Versatile',
    description:
      'Can be used with one or two hands. Two-handed use rolls the larger damage die noted for the weapon.',
    icon: Shuffle,
  },
  {
    key: 'reach',
    label: 'Reach',
    description: 'Adds 5 feet to your reach when you attack with it.',
    icon: MoveHorizontal,
  },
  {
    key: 'light',
    label: 'Light',
    description:
      'Small and easy to handle, which makes it usable for two-weapon fighting.',
    icon: Feather,
  },
  {
    key: 'heavy',
    label: 'Heavy',
    description: 'Small creatures have disadvantage on attack rolls made with it.',
    icon: Weight,
  },
  {
    key: 'two-handed',
    label: 'Two-handed',
    description: 'Requires two hands whenever you attack with it.',
    icon: Grab,
  },
];
