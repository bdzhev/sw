import { describe, expect, it } from 'vitest';

import { restFormSchema } from '../restForm.schema';

const paths = async (values: Record<string, unknown>, remainingDice = 5) => {
  const { errors } = await restFormSchema(remainingDice).parse(values as never);

  return errors.map((error) => {
    return error.path;
  });
};

describe('restFormSchema', () => {
  it('accepts a rest that spends nothing', async () => {
    expect(await paths({ diceSpent: '', healingRolled: '' })).toEqual([]);
  });

  it('accepts dice up to the remaining pool', async () => {
    expect(await paths({ diceSpent: '5', healingRolled: '17' })).toEqual([]);
  });

  it('refuses more dice than are left', async () => {
    expect(await paths({ diceSpent: '6', healingRolled: '0' })).toContain('diceSpent');
  });

  it('refuses anything but whole numbers', async () => {
    expect(await paths({ diceSpent: '2.5', healingRolled: '-3' })).toEqual([
      'diceSpent',
      'healingRolled',
    ]);
  });

  it('caps the healing rolled', async () => {
    expect(await paths({ diceSpent: '1', healingRolled: '1000' })).toContain(
      'healingRolled',
    );
  });
});
