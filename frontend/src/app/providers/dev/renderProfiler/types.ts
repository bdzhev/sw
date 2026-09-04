import type { DebuggerEvent } from 'vue';

/** What a component's last render was attributed to. */
export interface TriggerReason {
  /** First frame outside node_modules at trigger time — the mutating call site. */
  site?: string;
  key?: string;
  type?: string;
  /** True when the event came from the props object rather than a real dep. */
  isFromProps: boolean;
}

/** A component's decayed render frequency. Kept in a plain Map, never reactive. */
export interface ScoreEntry {
  score: number;
  lastAt: number;
}

/** One live box on the overlay. */
export interface FlashEntry {
  uid: number;
  name: string;
  elements: Element[];
  score: number;
  bornAt: number;
}

export type { DebuggerEvent };
