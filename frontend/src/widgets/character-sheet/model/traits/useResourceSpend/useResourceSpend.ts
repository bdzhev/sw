import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

import type { ResourceSubAbility } from '@widgets/character-sheet/config/traits';
import { spendAmount } from '@widgets/character-sheet/lib/traits';

import { useResourceMeta } from '../useResourceMeta';
import { spendAmountSchema } from './spendAmount.schema';
import type { UseResourceSpend, UseResourceSpendOptions } from './useResourceSpend.types';

export const useResourceSpend = (options: UseResourceSpendOptions): UseResourceSpend => {
  const { getResource, isOpen, onSpend } = options;

  const meta = useResourceMeta(getResource);

  const validationSchema = computed(() => {
    return spendAmountSchema(meta.remaining.value);
  });

  const form = useForm({ validationSchema, initialValues: { amount: '' } });

  /** Which variable-cost ability the amount field is standing in for, if any. */
  const selectedAbilityName = ref<string | null>(null);

  const amountLabel = computed(() => {
    return selectedAbilityName.value
      ? `${selectedAbilityName.value} — amount`
      : 'Custom amount';
  });

  const spend = (cost: number) => {
    const amount = spendAmount(cost, meta.remaining.value);

    if (amount === null) {
      return;
    }

    onSpend(amount);
  };

  const selectAbility = (ability: ResourceSubAbility) => {
    if (ability.cost === null) {
      selectedAbilityName.value = ability.name;

      return;
    }

    spend(ability.cost);
  };

  const isAbilityDisabled = (ability: ResourceSubAbility): boolean => {
    if (meta.isExhausted.value) {
      return true;
    }

    return ability.cost !== null && ability.cost > meta.remaining.value;
  };

  const runSubmit = form.handleSubmit((values) => {
    spend(Number(values.amount));
  });

  const submit = (event?: Event) => {
    void runSubmit(event);
  };

  watch(isOpen, (open) => {
    if (open) {
      return;
    }

    selectedAbilityName.value = null;
    form.resetForm({ values: { amount: '' } });
  });

  return {
    label: meta.label,
    remaining: meta.remaining,
    subAbilities: meta.subAbilities,
    hasSubAbilities: meta.hasSubAbilities,
    isExhausted: meta.isExhausted,
    isUntracked: meta.isUntracked,
    amountLabel,
    selectedAbilityName,
    selectAbility,
    isAbilityDisabled,
    spend,
    submit,
  };
};
