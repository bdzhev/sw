import type { AbilityScores as AbilityScoreTotals } from '@entities/characters';

export interface AbilityScoresProps {
  /** The stored raw scores — the editable half. */
  rawScores: AbilityScoreTotals;
  /** Raw plus equipped-item bonuses, scanned once by the tab. */
  totals: AbilityScoreTotals;
}
