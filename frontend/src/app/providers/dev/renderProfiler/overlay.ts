import { FLASH_TTL_MS, MAX_BOXES } from './constants';
import { scoreToColor } from './scores';
import type { FlashEntry } from './types';

interface PoolItem {
  box: HTMLDivElement;
  label: HTMLSpanElement;
}

interface PaintTarget {
  element: Element;
  name: string;
  score: number;
  age: number;
}

let container: HTMLDivElement | null = null;
const pool: PoolItem[] = [];

/**
 * Appended to `document.body`, never inside `#app`: several components there set
 * `backdrop-filter`, which creates a containing block and would silently reparent
 * a fixed-position overlay. `contain` keeps overlay writes out of app layout.
 */
const ensureContainer = () => {
  if (container) {
    return container;
  }

  container = document.createElement('div');
  container.dataset.renderProfiler = '';
  container.style.cssText = [
    'position:fixed',
    'inset:0',
    'pointer-events:none',
    'z-index:2147483000',
    'contain:layout style size',
  ].join(';');

  document.body.append(container);

  return container;
};

const takePoolItem = (index: number) => {
  const existing = pool[index];

  if (existing) {
    return existing;
  }

  const box = document.createElement('div');

  box.style.cssText = [
    'position:absolute',
    'top:0',
    'left:0',
    'box-sizing:border-box',
    'border:1px solid currentColor',
    'will-change:transform',
  ].join(';');

  const label = document.createElement('span');

  label.style.cssText = [
    'position:absolute',
    'top:0',
    'left:0',
    'font:10px/1.4 ui-monospace,monospace',
    'padding:0 3px',
    'white-space:nowrap',
    'color:black',
    'background:white',
  ].join(';');

  box.append(label);

  const item = { box, label };

  pool[index] = item;
  ensureContainer().append(box);

  return item;
};

/**
 * The chain of ancestors that clip this element. Computed once per element —
 * `getComputedStyle` is the expensive half, and the rects are read per frame
 * from already-clean layout.
 */
const clipChains = new WeakMap<Element, Element[]>();

const getClipChain = (element: Element) => {
  const cached = clipChains.get(element);

  if (cached) {
    return cached;
  }

  const chain: Element[] = [];
  let node = element.parentElement;

  while (node && node !== document.body) {
    const { overflow } = getComputedStyle(node);

    if (overflow !== 'visible') {
      chain.push(node);
    }

    node = node.parentElement;
  }

  clipChains.set(element, chain);

  return chain;
};

/**
 * The overlay sits at body level, so an ancestor's overflow does not clip it —
 * which would draw a box for a row scrolled out of its own scroller. Intersect
 * manually and drop the box when nothing is left.
 */
const resolveVisibleRect = (element: Element) => {
  const rect = element.getBoundingClientRect();

  let top = rect.top;
  let left = rect.left;
  let right = rect.right;
  let bottom = rect.bottom;

  for (const ancestor of getClipChain(element)) {
    const clip = ancestor.getBoundingClientRect();

    top = Math.max(top, clip.top);
    left = Math.max(left, clip.left);
    right = Math.min(right, clip.right);
    bottom = Math.min(bottom, clip.bottom);
  }

  top = Math.max(top, 0);
  left = Math.max(left, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);

  if (right - left < 1 || bottom - top < 1) {
    return null;
  }

  return { top, left, width: right - left, height: bottom - top };
};

/**
 * One frame. Every rect is read before any style is written, so the browser does
 * one forced layout for the batch instead of one per box.
 */
export const paint = (entries: FlashEntry[], now: number) => {
  const targets: PaintTarget[] = [];

  /** Hottest first, so the cap culls cold components rather than late ones. */
  const ordered = [...entries].sort((a, b) => {
    return b.score - a.score;
  });

  for (const entry of ordered) {
    if (targets.length >= MAX_BOXES) {
      break;
    }

    const age = now - entry.bornAt;

    for (const element of entry.elements) {
      if (!element.isConnected || targets.length >= MAX_BOXES) {
        continue;
      }

      targets.push({ element, name: entry.name, score: entry.score, age });
    }
  }

  /** Read pass. */
  const rects = targets.map((target) => {
    return resolveVisibleRect(target.element);
  });

  /** Write pass. */
  let painted = 0;

  targets.forEach((target, index) => {
    const rect = rects[index];

    if (!rect) {
      return;
    }

    const { box, label } = takePoolItem(painted);
    const fade = 1 - target.age / FLASH_TTL_MS;

    box.style.color = scoreToColor(target.score);
    box.style.opacity = String(Math.max(Math.min(fade * 1.6, 1), 0));
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
    box.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
    box.style.display = 'block';
    label.textContent = `${target.name} ×${Math.round(target.score)}`;

    painted += 1;
  });

  for (let index = painted; index < pool.length; index += 1) {
    pool[index].box.style.display = 'none';
  }
};

export const teardown = () => {
  container?.remove();
  container = null;
  pool.length = 0;
};
