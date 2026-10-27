import { describe, expect, it } from 'vitest';

import { itemFormSchema } from '../itemForm.schema';

/**
 * Tested through `toTypedSchema`'s own `parse`, which is the surface
 * vee-validate uses — not the raw zod object, which the module keeps private.
 *
 * The subject is the `.default()` rule documented in the schema: vee-validate
 * deletes a field's path when its component unmounts, so a field behind a
 * `v-if` arrives **absent**, not empty. `rules.md` §4 records this costing a
 * debugging session, because `FormSwitch` rendered no message and the form
 * silently refused to submit.
 */
const parse = (values: Record<string, unknown>) => {
  return itemFormSchema.parse(values as never);
};

const named = { name: 'Rope' };

describe('itemFormSchema — absent fields behind a v-if', () => {
  it('accepts a submission carrying nothing but a name', async () => {
    const { errors } = await parse(named);

    expect(errors).toEqual([]);
  });

  it('defaults every unmounted boolean to false rather than erroring', async () => {
    const { value, errors } = await parse(named);

    expect(errors).toEqual([]);
    expect(value).toMatchObject({
      isEquipped: false,
      hasBonuses: false,
      hasLimitedUses: false,
      resetOnLongRest: false,
      quickReference: false,
    });
  });

  it('defaults an absent description to an empty string', async () => {
    const { value } = await parse(named);

    expect(value?.description).toBe('');
  });
});

describe('itemFormSchema — name', () => {
  it('requires a name', async () => {
    const { errors } = await parse({});

    expect(
      errors.map((error) => {
        return error.path;
      }),
    ).toContain('name');
  });

  it('rejects control characters', async () => {
    const { errors } = await parse({ name: 'Rope\nand pulley' });

    expect(
      errors.map((error) => {
        return error.path;
      }),
    ).toContain('name');
  });
});

describe('itemFormSchema — the limited-uses cross-field rules', () => {
  it('demands a max once limited uses is ticked', async () => {
    const { errors } = await parse({ ...named, hasLimitedUses: true });

    expect(
      errors.map((error) => {
        return error.path;
      }),
    ).toContain('maxUses');
  });

  /** Untracked items leave both blank, which must stay legal. */
  it('allows a blank max while limited uses is off', async () => {
    const { errors } = await parse({ ...named, hasLimitedUses: false });

    expect(errors).toEqual([]);
  });

  it('rejects remaining above the max', async () => {
    const { errors } = await parse({
      ...named,
      hasLimitedUses: true,
      maxUses: 2,
      usesRemaining: 3,
    });

    expect(
      errors.map((error) => {
        return error.path;
      }),
    ).toContain('usesRemaining');
  });

  it('allows remaining equal to the max', async () => {
    const { errors } = await parse({
      ...named,
      hasLimitedUses: true,
      maxUses: 2,
      usesRemaining: 2,
    });

    expect(errors).toEqual([]);
  });
});

describe('itemFormSchema — stat modifiers', () => {
  it('allows a negative modifier', async () => {
    const { errors } = await parse({ ...named, str: -1 });

    expect(errors).toEqual([]);
  });

  it('rejects a fractional modifier', async () => {
    const { errors } = await parse({ ...named, str: 1.5 });

    expect(
      errors.map((error) => {
        return error.path;
      }),
    ).toContain('str');
  });
});
