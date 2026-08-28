/** What the freeform half of the add dialog hands back. */
export interface SpellSubmitValues {
  customName: string;
  customLevel: number;
  customDescription: string | null;
}

export interface UseSpellFormOptions {
  isOpen: () => boolean;
  onSubmit: (values: SpellSubmitValues) => void;
}
