export interface DeathSavePipProps {
  /** Its position in the row, which is what it reports when picked. */
  index: number;
  isFilled: boolean;
  /** The accessible name: the box is drawn without a visible one. */
  label: string;
}
