/**
 * Verified against Vue 3.5.18. Everything here reads unexported internals
 * (`subTree`, `vnode.anchor`, `vnode.targetAnchor`, `shapeFlag`, `type.__file`),
 * so re-check these on a Vue major/minor bump.
 */

/** ShapeFlags. Not exported from `vue`, so the bits are restated. */
export const SHAPE_COMPONENT = 6;
export const SHAPE_TELEPORT = 64;
export const SHAPE_SUSPENSE = 128;
export const SHAPE_COMPONENT_KEPT_ALIVE = 512;

/** A component contributes at most this many boxes — a Fragment root can hold many. */
export const MAX_ELEMENTS_PER_COMPONENT = 4;

/** Boxes painted per frame, chosen by descending score so hot components survive. */
export const MAX_BOXES = 48;

/** How long a box stays on screen. Re-positioned every frame while alive. */
export const FLASH_TTL_MS = 420;

/** Score halves every second, so a scroll burst cools off instead of pinning hot. */
export const SCORE_HALF_LIFE_MS = 1000;

/** Ramp domain. 1 = rendered once just now, 8+ = rendering constantly. */
export const SCORE_MIN = 1;
export const SCORE_MAX = 8;

/** An HMR patch re-renders whole subtrees; painting that is noise. */
export const HMR_QUIET_MS = 300;
