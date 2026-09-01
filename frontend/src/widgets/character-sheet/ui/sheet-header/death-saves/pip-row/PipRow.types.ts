export interface PipRowProps {
  /** Names the group: "successes" / "failures". */
  legend: string;
  /** Singular, for one pip's accessible name: "Success 2". */
  pipLabel: string;
  count: number;
  total: number;
}
