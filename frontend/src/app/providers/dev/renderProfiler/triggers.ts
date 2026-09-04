import type { DebuggerEvent, TriggerReason } from './types';

const reasons = new Map<number, TriggerReason>();

/**
 * The first frame outside the toolchain. At trigger time this is the mutating
 * call site — the pinia action, the query-cache write, the event handler — which
 * is strictly more useful than the dep key, because a render woken through a
 * computed gets no key at all (Dep.notify re-notifies with no debug payload).
 */
const captureSite = () => {
  const stack = new Error().stack;

  if (!stack) {
    return undefined;
  }

  const frame = stack
    .split('\n')
    .slice(1)
    .find((line) => {
      return (
        line.includes('/src/') &&
        !line.includes('node_modules') &&
        !line.includes('renderProfiler')
      );
    });

  return frame?.trim().replace(/^at\s+/, '');
};

/**
 * Keep the FIRST event per component per flush, not the last. A parent's patch
 * updates a child's props synchronously with recursion disabled, which fires
 * `renderTriggered` again with a props key — a consequence of the render, not
 * its cause. Last-wins would report that every time.
 */
export const recordTrigger = (
  uid: number,
  event: DebuggerEvent,
  props: object | null,
) => {
  const isFromProps = event.target === props;
  const existing = reasons.get(uid);

  if (existing && (!existing.isFromProps || isFromProps)) {
    return;
  }

  reasons.set(uid, {
    site: captureSite(),
    key: typeof event.key === 'symbol' ? event.key.toString() : (event.key as string),
    type: event.type,
    isFromProps,
  });
};

export const takeTrigger = (uid: number) => {
  return reasons.get(uid);
};

export const forgetTrigger = (uid: number) => {
  reasons.delete(uid);
};

export const clearTriggers = () => {
  reasons.clear();
};
