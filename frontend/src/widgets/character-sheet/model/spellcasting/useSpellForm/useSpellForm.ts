import { useForm } from 'vee-validate';
import { watch } from 'vue';

import { spellFormSchema } from './spellForm.schema';
import type { UseSpellForm, UseSpellFormOptions } from './useSpellForm.types';

/**
 * The freeform entry. There is no edit case — a custom spell is deleted and
 * re-added — so this only ever starts empty.
 */
export const useSpellForm = (options: UseSpellFormOptions): UseSpellForm => {
  const { isOpen, onSubmit } = options;

  const form = useForm({
    validationSchema: spellFormSchema,
    initialValues: { name: '', description: '' },
  });

  const runSubmit = form.handleSubmit((values) => {
    onSubmit({
      customName: values.name,
      customLevel: values.level,
      customDescription: values.description.trim() || null,
    });
  });

  const submit = (event?: Event) => {
    void runSubmit(event);
  };

  /** The dialog stays mounted between openings, so the fields are cleared on open. */
  watch(isOpen, (open) => {
    if (!open) {
      return;
    }

    form.resetForm({ values: { name: '', description: '' } });
  });

  return { submit };
};
