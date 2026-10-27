import { describe, expect, it } from 'vitest';

import { ResetTrigger } from '@shared/api/characters';

import { resourceFormSchema } from '../resourceForm.schema';

const parse = (values: Record<string, unknown>) => {
  return resourceFormSchema.parse(values as never);
};

const paths = async (values: Record<string, unknown>) => {
  const { errors } = await parse(values);

  return errors.map((error) => {
    return error.path;
  });
};

/** Everything the dialog renders unconditionally. */
const mounted = {
  resource: 'ki',
  description: '',
  quickReference: false,
  resetTrigger: ResetTrigger.SHORT,
};

describe('resourceFormSchema', () => {
  it('accepts a known resource with the unconditional fields filled', async () => {
    expect(await paths({ ...mounted, customName: '' })).toEqual([]);
  });

  it('requires a resource', async () => {
    expect(await paths({ ...mounted, resource: '', customName: '' })).toContain(
      'resource',
    );
  });

  it('demands a name for a custom resource', async () => {
    expect(
      await paths({ ...mounted, resource: 'custom', customName: '', maxValue: 3 }),
    ).toContain('customName');
  });

  it('demands a max for a custom resource', async () => {
    expect(await paths({ ...mounted, resource: 'custom', customName: 'Rage' })).toContain(
      'maxValue',
    );
  });

  /** Zero is a deliberate answer — a real pool that happens to be empty. */
  it('accepts a zero max for a custom resource', async () => {
    expect(
      await paths({ ...mounted, resource: 'custom', customName: 'Rage', maxValue: 0 }),
    ).toEqual([]);
  });

  /** `current` is `.optional()`, so the edit-only field may be absent. */
  it('tolerates an absent current, which is rendered only while editing', async () => {
    expect(await paths({ ...mounted, customName: '' })).toEqual([]);
  });

  /**
   * The regression this file was written for. `customName` sits behind
   * `v-if="isCustomResource"` and the form does not pass
   * `keepValuesOnUnmount`, so picking Custom and then a known resource deletes
   * the path. Without `.default('')` the schema returned `Required` on a field
   * the user cannot see, `FormInput` rendered no message, and the dialog
   * refused to submit with no explanation — rules.md §4's documented failure.
   */
  it('accepts an absent customName once the field has unmounted', async () => {
    expect(await paths(mounted)).toEqual([]);
  });

  it('defaults an absent customName to an empty string', async () => {
    const { value } = await parse(mounted);

    expect(value?.customName).toBe('');
  });

  /** The default must not let a custom resource through unnamed. */
  it('still demands a name when the resource is custom', async () => {
    expect(await paths({ ...mounted, resource: 'custom', maxValue: 3 })).toContain(
      'customName',
    );
  });
});
