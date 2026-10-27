import { SCORE_HALF_LIFE_MS, SCORE_MAX, SCORE_MIN } from './constants';
import type { ScoreEntry } from './types';

/**
 * Plain Map on purpose. Writing to a reactive structure from an `updated` hook
 * while a component reads it is the "Maximum recursive updates exceeded" path.
 */
const scores = new Map<number, ScoreEntry>();

/**
 * Exponential decay evaluated lazily on read, so there is no timer and no sweep
 * over dead entries. A monotonic counter would pin every component at "hot"
 * after one scroll gesture and never recover.
 */
export const bumpScore = (uid: number, now: number) => {
  const previous = scores.get(uid);
  const decayed = previous
    ? previous.score * 0.5 ** ((now - previous.lastAt) / SCORE_HALF_LIFE_MS)
    : 0;
  const score = decayed + 1;

  scores.set(uid, { score, lastAt: now });

  return score;
};

export const forgetScore = (uid: number) => {
  scores.delete(uid);
};

export const clearScores = () => {
  scores.clear();
};

/** Cool to hot, five stops, mirroring what React DevTools reads as a ramp. */
const RAMP = [
  { r: 90, g: 160, b: 255 },
  { r: 90, g: 210, b: 160 },
  { r: 230, g: 200, b: 80 },
  { r: 240, g: 150, b: 60 },
  { r: 240, g: 80, b: 80 },
] as const;

/** Score to `rgb(...)`, clamped so the ramp has a defined top and bottom. */
export const scoreToColor = (score: number) => {
  const clamped = Math.min(Math.max(score, SCORE_MIN), SCORE_MAX);
  const ratio = (clamped - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const position = ratio * (RAMP.length - 1);
  const index = Math.min(Math.floor(position), RAMP.length - 2);
  const blend = position - index;

  const from = RAMP[index];
  const to = RAMP[index + 1];

  const channel = (a: number, b: number) => {
    return Math.round(a + (b - a) * blend);
  };

  return `rgb(${channel(from.r, to.r)} ${channel(from.g, to.g)} ${channel(from.b, to.b)})`;
};
