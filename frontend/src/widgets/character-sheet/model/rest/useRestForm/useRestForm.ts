import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';

import { restFormSchema } from './restForm.schema';
import type { UseRestForm, UseRestFormOptions } from './useRestForm.types';

const EMPTY = { diceSpent: '', healingRolled: '' };

/**
 * The short rest's two player-owned numbers. A long rest has no form at all —
 * everything it restores is already stored on the rows.
 */
export const useRestForm = (options: UseRestFormOptions): UseRestForm => {
  const { getRemainingDice, isOpen, onSubmit } = options;

  const validationSchema = computed(() => {
    return restFormSchema(getRemainingDice());
  });

  const form = useForm({ validationSchema, initialValues: EMPTY });

  const runSubmit = form.handleSubmit((values) => {
    onSubmit({
      diceSpent: Number(values.diceSpent || '0'),
      healingRolled: Number(values.healingRolled || '0'),
    });
  });

  /** Named `submit`, not `handleSubmit`: the component names the handler. */
  const submit = (event?: Event): void => {
    void runSubmit(event);
  };

  watch(isOpen, (open) => {
    if (!open) {
      return;
    }

    form.resetForm({ values: EMPTY });
  });

  return { submit };
};
