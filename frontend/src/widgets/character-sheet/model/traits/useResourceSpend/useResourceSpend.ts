import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

import type { ResourceSubAbility } from '@widgets/character-sheet/config/traits';

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

  /** The clamp the design asks for: a spend can never take the pool below zero. */
  const spend = (cost: number) => {
    const clamped = Math.min(Math.max(1, cost), meta.remaining.value);

    if (clamped <= 0) {
      return;
    }

    onSpend(clamped);
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

  const submit = form.handleSubmit((values) => {
    spend(Number(values.amount));
  });

  const handleSubmit = (event?: Event) => {
    void submit(event);
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
    handleSubmit,
  };
};
