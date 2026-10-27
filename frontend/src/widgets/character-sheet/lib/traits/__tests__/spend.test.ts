import { describe, expect, it } from 'vitest';

import { spendAmount } from '../spend';

/**
 * The seam both spend paths now cross. Before it, `ResourceSpendControl` clamped
 * its own flat tap with a bare `Math.min` — no floor — and forwarded the
 * dialog's amount untouched, so an exhausted pool could emit `spend(0)`.
 */
describe('spendAmount', () => {
  it('spends the asked-for cost when the pool covers it', () => {
    expect(spendAmount(2, 5)).toBe(2);
  });

  it('never takes the pool below zero', () => {
    expect(spendAmount(5, 2)).toBe(2);
  });

  /** `null`, not `0` — a caller cannot forward an empty spend by forgetting to check. */
  it('is null on an exhausted pool', () => {
    expect(spendAmount(1, 0)).toBeNull();
    expect(spendAmount(9, 0)).toBeNull();
  });

  /**
   * The floor. `ResourceSubAbility.cost` is `number | null`, so nothing at the
   * type level stops a 0 landing in the table — it still costs one use.
   */
  it('floors a zero or negative cost at one use', () => {
    expect(spendAmount(0, 3)).toBe(1);
    expect(spendAmount(-2, 3)).toBe(1);
  });

  it('floors at one even when only one is left', () => {
    expect(spendAmount(0, 1)).toBe(1);
  });
});
