export interface PactMagicSlots {
  slots: number;
  slotLevel: number;
}

/** Slot maxima keyed by slot level as a string, matching `spellSlots.current`. */
export type SlotTableMaxima = Partial<Record<string, number>>;
