export interface AbilityScoreProps {
  /** Three-letter form, e.g. `str` — displayed uppercase. */
  abbr: string;
  name: string;
  /** The stored raw score — the only editable half. */
  score: number;
  /** Raw score plus equipped-item bonuses; equals `score` when there are none. */
  total: number;
  /** Derived from `total`, so gear is reflected in what the player rolls with. */
  modifier: number;
}
