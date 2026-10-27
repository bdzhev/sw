import {
  getCurrentInstance,
  onRenderTriggered,
  onUpdated,
  type App,
  type ComponentInternalInstance,
} from 'vue';

import { FLASH_TTL_MS, HMR_QUIET_MS } from './constants';
import { paint, teardown } from './overlay';
import { resolveElements } from './resolveElements';
import { bumpScore, clearScores, forgetScore } from './scores';
import { clearTriggers, forgetTrigger, recordTrigger, takeTrigger } from './triggers';
import type { FlashEntry } from './types';

const live = new Map<number, FlashEntry>();

let frameHandle = 0;
let quietUntil = 0;

/**
 * `__file` is attached by @vitejs/plugin-vue in dev only, and only to SFCs it
 * compiles — a prebuilt dependency carries `__name` but never `__file`. So this
 * is also the vendor filter, and it earns its keep: one open dialog is ten
 * stacked reka-ui wrappers over a single div.
 */
const resolveName = (instance: ComponentInternalInstance) => {
  const type = instance.type as { __name?: string; name?: string; __file?: string };

  if (!type.__file?.includes('/src/')) {
    return null;
  }

  return type.__name ?? type.name ?? type.__file.split('/').pop() ?? 'Anonymous';
};

const logRender = (name: string, score: number, uid: number) => {
  const reason = takeTrigger(uid);
  const where =
    reason?.site ?? (reason?.key ? `${reason.type} ${reason.key}` : 'unknown');

  // oxlint-disable-next-line no-console
  console.debug(`[render-profiler] ${name} ×${Math.round(score)} ← ${where}`);
};

const runFrame = () => {
  frameHandle = 0;

  const now = performance.now();

  for (const [uid, entry] of live) {
    if (now - entry.bornAt > FLASH_TTL_MS) {
      live.delete(uid);
    }
  }

  paint([...live.values()], now);
  clearTriggers();

  /** Re-read every rect while a box is alive: a snapshot drifts away from an
      element mid-transition, and dialogs, the drawer and the carousel all move. */
  if (live.size) {
    frameHandle = requestAnimationFrame(runFrame);
  }
};

const scheduleFrame = () => {
  if (!frameHandle) {
    frameHandle = requestAnimationFrame(runFrame);
  }
};

const handleUpdated = (instance: ComponentInternalInstance, name: string) => {
  if (performance.now() < quietUntil) {
    return;
  }

  const elements = resolveElements(instance.subTree);

  if (!elements.length) {
    return;
  }

  const now = performance.now();
  const score = bumpScore(instance.uid, now);

  live.set(instance.uid, { uid: instance.uid, name, elements, score, bornAt: now });
  logRender(name, score, instance.uid);
  scheduleFrame();
};

/**
 * Flash every component as it re-renders, coloured by how often — Vue's answer
 * to React DevTools' "highlight updates". Install it by uncommenting the
 * `app.use` line in `app/index.ts`; that commented import is also what keeps
 * this out of the production bundle.
 */
export const renderProfiler = {
  install(app: App) {
    if (!import.meta.env.DEV) {
      return;
    }

    /**
     * Lifecycle keys only. A mixin declaring `props` or `emits` would route every
     * component in the app through the merged props resolver.
     *
     * The hooks are registered imperatively rather than as mixin options because
     * `renderTriggered` has no merge strategy — it is a plain overwrite, so any
     * component declaring its own would silently replace ours. `beforeCreate`
     * does merge as an array, and `currentInstance` is set while it runs.
     */
    app.mixin({
      beforeCreate() {
        const instance = getCurrentInstance();

        if (!instance) {
          return;
        }

        const name = resolveName(instance);

        if (!name) {
          return;
        }

        onRenderTriggered((event) => {
          recordTrigger(instance.uid, event, instance.props);
        });

        onUpdated(() => {
          handleUpdated(instance, name);
        });
      },

      beforeUnmount() {
        const instance = getCurrentInstance();

        if (!instance) {
          return;
        }

        live.delete(instance.uid);
        forgetScore(instance.uid);
        forgetTrigger(instance.uid);
      },
    });

    /** An HMR patch re-renders whole subtrees; painting that is pure noise. */
    import.meta.hot?.on('vite:beforeUpdate', () => {
      quietUntil = performance.now() + HMR_QUIET_MS;
      live.clear();
      clearScores();
      clearTriggers();
      teardown();
    });
  },
};
