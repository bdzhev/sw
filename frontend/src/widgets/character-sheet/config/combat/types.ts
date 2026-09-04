import type { Component } from 'vue';

import { CollectionKey } from '@shared/api/characters';
import type {
  AttackAbility,
  AttackDelivery,
  CharacterStat,
  CollectionCreate,
} from '@shared/api/characters';

/** One weapon property: compact indicator in the list, full text in the detail. */
export interface AttackPropertyDefinition {
  key: string;
  label: string;
  description: string;
  icon: Component;
}

/** The three fields the attack/damage arithmetic actually reads. */
export interface AttackMathInput {
  ability: AttackAbility;
  proficient: boolean;
  additionalBonus: number;
}

export interface AttackTotals {
  /** Which score won — finesse resolves to whichever of str/dex is higher. */
  stat: CharacterStat;
  abilityModifier: number;
  /** Zero unless the attack is marked proficient. */
  proficiencyBonus: number;
  additionalBonus: number;
  attackBonus: number;
  damageBonus: number;
}

/** What the add/edit dialog hands back — the create body and the patch are one shape. */
export type AttackBody = CollectionCreate<CollectionKey.ATTACKS>;

export interface AttackFormValues {
  name: string;
  ability: AttackAbility;
  delivery: AttackDelivery;
  proficient: boolean;
  damageDice: string;
  damageType: string;
  additionalBonus: string;
  ammoRemaining: string;
  properties: string[];
}
