/**
 * How much a spend actually takes from a pool.
 *
 * `null` means "nothing to spend" rather than `0`, so a caller cannot forward an
 * empty spend by forgetting to check. Both the inline tap and the dialog cross
 * this seam; before it, the control clamped its own flat tap and forwarded the
 * dialog's amount untouched, so the invariant its own options type declares —
 * *"always a positive number already clamped to the remaining pool"* — was
 * enforced in one of the two producers.
 *
 * The floor of 1 is what makes the emit meaningful: a sub-ability with a cost of
 * 0 in the table, or a hand-typed 0, is still a spend of one use.
 */
export const spendAmount = (cost: number, remaining: number): number | null => {
  const clamped = Math.min(Math.max(1, cost), remaining);

  return clamped > 0 ? clamped : null;
};
