/**
 * One line of the after-the-rest summary. `isApplied` is the whole reason a
 * line can exist while saying nothing happened: a resource with no max
 * recorded, or a slot pool with no maxima, has to be *named* rather than left
 * out, or silence reads as "there was nothing there".
 */
export interface RestSummaryLine {
  label: string;
  detail: string;
  isApplied: boolean;
}
