import { describe, expect, it } from 'vitest';

import { formatSigned } from '../numbers';

/**
 * Pinned because three hand-rolled copies of this existed and disagreed. The
 * `0` case is the one that separates them: this returns `+0`, and a
 * `n >= 0 ? '+' : ''` copy agrees while a bare `+${n}` template does not.
 */
describe('formatSigned', () => {
  it('prefixes a plus to zero', () => {
    expect(formatSigned(0)).toBe('+0');
  });

  it('prefixes a plus to a positive', () => {
    expect(formatSigned(3)).toBe('+3');
  });

  it('leaves a negative with its own sign, never a doubled one', () => {
    expect(formatSigned(-1)).toBe('-1');
    expect(formatSigned(-12)).toBe('-12');
  });
});
