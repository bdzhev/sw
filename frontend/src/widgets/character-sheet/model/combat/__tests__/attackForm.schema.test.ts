import { describe, expect, it } from 'vitest';

import { AttackAbility, AttackDelivery } from '@shared/api/characters';

import { attackFormSchema } from '../attackForm.schema';

const paths = async (values: Record<string, unknown>) => {
  const { errors } = await attackFormSchema.parse(values as never);

  return errors.map((error) => {
    return error.path;
  });
};

/** Everything the dialog renders unconditionally. */
const mounted = {
  name: 'Longsword',
  ability: AttackAbility.STRENGTH,
  delivery: AttackDelivery.MELEE,
  proficient: true,
  damageDice: '1d8',
  damageType: 'slashing',
  additionalBonus: '',
  properties: [],
};

describe('attackFormSchema', () => {
  it('accepts a melee attack with the ammo field never mounted', async () => {
    expect(await paths({ ...mounted, ammoRemaining: '' })).toEqual([]);
  });

  it('requires a name', async () => {
    expect(await paths({ ...mounted, name: '', ammoRemaining: '' })).toContain('name');
  });

  /** Blank and a lone minus both occur mid-typing in the bonus field. */
  it('tolerates a half-typed additional bonus', async () => {
    expect(await paths({ ...mounted, additionalBonus: '-', ammoRemaining: '' })).toEqual(
      [],
    );
  });

  it('rejects a non-numeric additional bonus', async () => {
    expect(
      await paths({ ...mounted, additionalBonus: 'abc', ammoRemaining: '' }),
    ).toContain('additionalBonus');
  });

  /**
   * The regression this file was written for. `ammoRemaining` sits behind
   * `v-if="showsAmmo"` and the form does not pass `keepValuesOnUnmount`, so
   * switching a thrown weapon to melee deletes the path. Without `.default('')`
   * the schema returned `Required` on a field the user cannot see and the
   * dialog refused to submit with no explanation — rules.md §4's failure.
   */
  it('accepts an absent ammoRemaining once the field has unmounted', async () => {
    expect(await paths(mounted)).toEqual([]);
  });

  it('defaults an absent ammoRemaining to an empty string', async () => {
    const { value } = await attackFormSchema.parse(mounted as never);

    expect(value?.ammoRemaining).toBe('');
  });

  /** The default must not weaken the range check when a value is present. */
  it('still rejects ammo above the limit', async () => {
    expect(await paths({ ...mounted, ammoRemaining: '99999' })).toContain(
      'ammoRemaining',
    );
  });
});
