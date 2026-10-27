/**
 * Reparameterises scroll progress so travel is slowest where a panel is aligned
 * and fastest between panels — panels resist being scrolled past instead of
 * being somewhere a snap tween drags you to. Slope is `1 - strength` at a panel
 * and `1 + strength / 2` mid-gap; `strength` 0 is uniform travel.
 *
 * Every `index / steps` is a fixed point, so a ScrollTrigger `snapTo` of
 * `1 / steps` still lands exactly on a panel.
 */
export const createStickyEase = (steps: number, strength: number): gsap.EaseFunction => {
  return (progress) => {
    const scaled = progress * steps;
    const index = Math.min(Math.floor(scaled), steps - 1);
    const local = scaled - index;
    const smoothed = local * local * (3 - 2 * local);

    return (index + local + strength * (smoothed - local)) / steps;
  };
};
