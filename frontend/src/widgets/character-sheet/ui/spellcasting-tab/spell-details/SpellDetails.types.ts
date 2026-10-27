export interface SpellDetailsProps {
  castingTime: string | null;
  rangeText: string | null;
  /** Already joined for display — the material text is folded into the `M` entry. */
  components: string | null;
  duration: string | null;
  description: string | null;
  higherLevel: string | null;
}
