export interface RestFormValues {
  diceSpent: number;
  healingRolled: number;
}

export interface UseRestFormOptions {
  /** Read lazily: the pool shrinks as dice are spent elsewhere on the tab. */
  getRemainingDice: () => number;
  isOpen: () => boolean;
  onSubmit: (values: RestFormValues) => void;
}

export interface UseRestForm {
  submit: (event?: Event) => void;
}
