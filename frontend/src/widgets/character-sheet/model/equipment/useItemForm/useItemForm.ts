import { useForm } from 'vee-validate';
import { computed, watch, type ComputedRef } from 'vue';

import { CharacterStat, type InventoryItem } from '@shared/api/characters';

import { hasStatModifiers } from '@widgets/character-sheet/lib/equipment';

import { itemFormSchema } from './itemForm.schema';
import type { UseItemFormOptions } from './useItemForm.types';

const DEFAULT_QUANTITY = 1;

/** The six ability keys, in sheet order, so the form and the row agree. */
const STATS = Object.values(CharacterStat);

interface UseItemForm {
  title: ComputedRef<string>;
  isEditing: ComputedRef<boolean>;
  hasBonuses: ComputedRef<boolean>;
  hasLimitedUses: ComputedRef<boolean>;
  handleSubmit: (event?: Event) => void;
}

const blankValues = (): Record<string, unknown> => {
  return {
    name: '',
    quantity: DEFAULT_QUANTITY,
    isEquipped: false,
    hasBonuses: false,
    str: undefined,
    dex: undefined,
    con: undefined,
    int: undefined,
    wis: undefined,
    cha: undefined,
    hasLimitedUses: false,
    maxUses: undefined,
    usesRemaining: undefined,
    resetOnLongRest: false,
    description: '',
    quickReference: false,
  };
};

const valuesFromItem = (item: InventoryItem): Record<string, unknown> => {
  const modifiers = STATS.reduce<Record<string, number | undefined>>((acc, stat) => {
    acc[stat] = item.statModifiers[stat];

    return acc;
  }, {});

  return {
    ...blankValues(),
    ...modifiers,
    name: item.name,
    quantity: item.quantity,
    isEquipped: item.isEquipped,
    hasBonuses: hasStatModifiers(item),
    hasLimitedUses: item.maxUses !== null,
    maxUses: item.maxUses ?? undefined,
    usesRemaining: item.usesRemaining ?? undefined,
    resetOnLongRest: item.resetOnLongRest,
    description: item.description ?? '',
    quickReference: item.quickReference,
  };
};

export const useItemForm = (options: UseItemFormOptions): UseItemForm => {
  const { getItem, isOpen, onSubmit } = options;

  const form = useForm({
    validationSchema: itemFormSchema,
    initialValues: blankValues(),
  });

  const isEditing = computed(() => {
    return getItem() !== null;
  });

  const title = computed(() => {
    return isEditing.value ? 'Edit item' : 'Add an item';
  });

  const hasBonuses = computed(() => {
    return Boolean(form.values.hasBonuses);
  });

  const hasLimitedUses = computed(() => {
    return Boolean(form.values.hasLimitedUses);
  });

  const submit = form.handleSubmit((values) => {
    /**
     * `hasBonuses` and `hasLimitedUses` are form-only switches: unticking one
     * clears what it covered rather than leaving an orphaned bonus the player
     * cannot see. The row stores absolutes, so a cleared field is `null`/`{}`.
     */
    const statModifiers = values.hasBonuses
      ? STATS.reduce<Partial<Record<CharacterStat, number>>>((acc, stat) => {
          const bonus = values[stat];

          if (bonus) {
            acc[stat] = bonus;
          }

          return acc;
        }, {})
      : {};

    const maxUses = values.hasLimitedUses ? (values.maxUses ?? null) : null;
    /** A new tracked item starts full; an edited one keeps what it had. */
    const entered = values.usesRemaining ?? (isEditing.value ? 0 : maxUses);

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      quantity: values.quantity ?? DEFAULT_QUANTITY,
      maxUses,
      usesRemaining: maxUses === null ? null : Math.min(entered ?? maxUses, maxUses),
      resetOnLongRest: values.hasLimitedUses ? values.resetOnLongRest : false,
      statModifiers,
      isEquipped: values.isEquipped,
      quickReference: values.quickReference,
    });
  });

  const handleSubmit = (event?: Event): void => {
    void submit(event);
  };

  /** Reset on open, not on close: closing mid-edit must not blank the boxes first. */
  watch(isOpen, (open) => {
    if (!open) return;

    const item = getItem();

    form.resetForm({ values: item ? valuesFromItem(item) : blankValues() });
  });

  return { title, isEditing, hasBonuses, hasLimitedUses, handleSubmit };
};
